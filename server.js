const express = require('express');
const stripe = require('stripe')('sk_test_51RC3rdGavfGkHWZgFBK4G5BmFj9M7tqVvGvEYz90dttwDba0Gakm1Yi90XJLRwWWOtuLpucafo6NhguzifTpgzMC00lxA7jCJ9');
const cors = require('cors');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch'); // مكان التخزين المحلي


const app = express();
app.use(cors());
app.use(express.json());

// ✅ متغير لتتبع عدد عمليات الدفع الناجحة
// استرجاع العدد من localStorage أو البدء بـ 0
let successfulPayments = parseInt(localStorage.getItem('payments')) || 0;


// ✅ نقطة الدفع (Payment Intent)
app.post('/create-payment-sheets', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: 'usd',
    });

    // ✅ زيادة العداد عند كل طلب إنشاء عملية دفع (ممكن تعدليها بناءً على حالة الدفع لاحقًا)
    

    res.json({ 
      status: 'success',
      clientSecret: paymentIntent.client_secret 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error',
      message: err.message 
    });
  }
});

// ✅ نقطة لإرجاع عدد العمليات الناجحة
app.post('/payment-success', (req, res) => {
    successfulPayments++;
    localStorage.setItem('payments', successfulPayments);
    res.json({ status: 'success' });
  });
  
  // ✅ نقطة لجلب عدد عمليات الدفع الناجحة
  app.get('/payment-count', (req, res) => {
    res.json({ count: successfulPayments });
  });
// ✅ تشغيل السيرفر
app.listen(3001, () => console.log('🚀 Server running on port 3001'));
