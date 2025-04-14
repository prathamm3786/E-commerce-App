import express from "express";
import {
  placeOrder,
  placeOrdersStripe,
  placeOrdersRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
} from "../controllers/orderControllers.js";
import adminAuth from "../middleware/adminAuth.js";
import auth from "../middleware/auth.js";

const router = express.Router();

//admin side
router.post("/list", adminAuth, allOrders);
router.post("/status", adminAuth, updateStatus);

//payment gateway
router.post("/stripe", auth, placeOrdersStripe);
router.post("/razorpay", auth, placeOrdersRazorpay);
router.post("/place", auth, placeOrder);


//user side
router.post("/userorders", auth, userOrders);
router.post("/verifyStripe" , auth,verifyStripe)
router.post("/verifyRazorpay" , auth,verifyRazorpay)
export default router;
