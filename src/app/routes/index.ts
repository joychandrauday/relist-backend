import { Router } from 'express';
import { userRoutes } from '../modules/Users/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { ListingRoutes } from '../modules/listings/listing.route';
import { TransactionRoutes } from '../modules/transaction/transaction.routes';
import { messageRouter } from '../modules/messages/message.routes';

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
   {
      path: '/transactions',
      route: TransactionRoutes,
   },
   {
      path: '/messages',
      route: messageRouter,
   },
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
