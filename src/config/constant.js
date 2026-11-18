// import { UserRole } from '../utils/auth.roles'

export default {
  webBaseURL: process.env.MIX_APP_URL
}
// yarn build (producción) usa el backend publicado; yarn serve, el local.
export const apiUrl = process.env.NODE_ENV === 'production' ? 'https://backendhospiespe.xyz' : 'http://localhost:3000'

export const currentUser = {
  id: 1,
  title: 'Sarah Kortney',
  img: '/assets/img/profiles/l-1.jpg',
  date: 'Last seen today 15:24'
  // role: UserRole.Admin
}
export const isAuthGuardActive = true
