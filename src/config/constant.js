// import { UserRole } from '../utils/auth.roles'

export default {
  webBaseURL: process.env.MIX_APP_URL
}
// export const apiUrl = 'https://backendhospiespe.xyz'
export const apiUrl = 'http://localhost:3000'

export const currentUser = {
  id: 1,
  title: 'Sarah Kortney',
  img: '/assets/img/profiles/l-1.jpg',
  date: 'Last seen today 15:24'
  // role: UserRole.Admin
}
export const isAuthGuardActive = true
