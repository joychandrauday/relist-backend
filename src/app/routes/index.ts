import { Router } from 'express';
import { userRoutes } from '../modules/Users/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { ListingRoutes } from '../modules/listings/listing.route';
import { TransactionRoutes } from '../modules/transaction/transaction.routes';
import { messageRouter } from '../modules/messages/message.routes';
import { orderRoutes } from '../modules/Orders/order.routes';
import { categoryRouter } from '../modules/category/category.routes';
import { FlashSaleRoutes } from '../modules/flashSell/flashSale.routes';
import { NewsLetterRoutes } from '../modules/newsletter/newsletter.route';

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

   {
      path: '/orders',
      route: orderRoutes,
   },
   {
      path: '/category',
      route: categoryRouter,
   },
   {
      path: '/flash-sale',
      route: FlashSaleRoutes,
   },
   {
      path: '/newsletter',
      route: NewsLetterRoutes,
   },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
