import { NextRequest, NextResponse } from 'next/server'
import { queryOne, exec } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { z } from 'zod'
const S = z.object({full_name:z.string().min(2).optional(),bio:z.string().optional(),date_of_birth:z.string().optional(),gender:z.string().optional(),country:z.string().optional(),language:z.string().optional(),timezone:z.string().optional(),email_notifications:z.boolean().optional(),marketing_emails:z.boolean().optional(),private_profile:z.boolean().optional()})
export async function GET(req: NextRequest) {
  try {
    const {id:uid} = await requireUser(req)
    const [profile,settings,streak,sub,style] = await Promise.all([
      queryOne(`SELECT up.*,u.email,u.role FROM user_profiles up JOIN users u ON u.id=up.user_id WHERE up.user_id=@uid`,{uid}),
      queryOne(`SELECT * FROM user_settings WHERE user_id=@uid`,{uid}),
      queryOne(`SELECT current_streak,longest_streak FROM user_study_streaks WHERE user_id=@uid`,{uid}),
      queryOne(`SELECT us.*,sp.name AS plan_name,sp.price FROM user_subscriptions us JOIN subscription_plans sp ON sp.id=us.plan_id WHERE us.user_id=@uid AND us.status='active'`,{uid}),
      queryOne(`SELECT dominant_style FROM ai_learning_styles WHERE user_id=@uid`,{uid}),
    ])
    return NextResponse.json({data:{profile,settings,streak,subscription:sub,learning_style:style}})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}
export async function PUT(req: NextRequest) {
  try {
    const {id:uid} = await requireUser(req)
    const p = S.safeParse(await req.json())
    if (!p.success) return NextResponse.json({error:'Dữ liệu không hợp lệ'},{status:400})
    const d = p.data
    const profileFields:string[] = []
    const profileParams:Record<string,any> = {uid}
    if (d.full_name!==undefined){profileFields.push('full_name=@fn');profileParams.fn=d.full_name}
    if (d.bio!==undefined){profileFields.push('bio=@bio');profileParams.bio=d.bio}
    if (d.date_of_birth!==undefined){profileFields.push('date_of_birth=@dob');profileParams.dob=d.date_of_birth}
    if (d.gender!==undefined){profileFields.push('gender=@gender');profileParams.gender=d.gender}
    if (d.country!==undefined){profileFields.push('country=@country');profileParams.country=d.country}
    if (profileFields.length) await exec(`UPDATE user_profiles SET ${profileFields.join(',')},updated_at=GETDATE() WHERE user_id=@uid`,profileParams)
    const settingFields:string[] = []
    const settingParams:Record<string,any> = {uid}
    if (d.language!==undefined){settingFields.push('language=@lang');settingParams.lang=d.language}
    if (d.timezone!==undefined){settingFields.push('timezone=@tz');settingParams.tz=d.timezone}
    if (d.email_notifications!==undefined){settingFields.push('email_notifications=@en');settingParams.en=d.email_notifications}
    if (d.marketing_emails!==undefined){settingFields.push('marketing_emails=@me');settingParams.me=d.marketing_emails}
    if (d.private_profile!==undefined){settingFields.push('private_profile=@pp');settingParams.pp=d.private_profile}
    if (settingFields.length) await exec(`UPDATE user_settings SET ${settingFields.join(',')},updated_at=GETDATE() WHERE user_id=@uid`,settingParams)
    return NextResponse.json({message:'Cập nhật thành công'})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}