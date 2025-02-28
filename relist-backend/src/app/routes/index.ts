import { Router } from 'express';
import { userRoutes } from '../modules/Users/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { ListingRoutes } from '../modules/listings/listing.route';

const router = Router();

const moduleRoutes = [
   {
      path: '/users',
      route: userRoutes,
   },
   {
      path: '/auth',
      route: AuthRoutes,
   },
   {
      path: '/listings',
      route: ListingRoutes,
   },
   // {
   //    path: '/category',
   //    route: CategoryRoutes,
   // },
   // {
   //    path: '/brand',
   //    route: BrandRoutes,
   // },
   // {
   //    path: '/product',
   //    route: ProductRoutes,
   // },
   // {
   //    path: '/flash-sale',
   //    route: FlashSaleRoutes,
   // },
   // {
   //    path: '/order',
   //    route: OrderRoutes,
   // },
   // {
   //    path: '/coupon',
   //    route: CouponRoutes,
   // },
   // {
   //    path: '/ssl',
   //    route: SSLRoutes,
   // },
   // {
   //    path: '/review',
   //    route: ReviewRoutes,
   // },
   // {
   //    path: '/meta',
   //    route: MetaRoutes,
   // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
