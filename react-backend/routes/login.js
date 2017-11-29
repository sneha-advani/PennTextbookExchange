// var express = require('express');
// var router = express.Router();

// var User = require('../User.js');

// // // /* GET users listing. */
// // // router.post('/', function(req, res, next) {
// // //   res.json([{
// // //   	name: "Book1"
// // //   }, {
// // //   	name: "Book2"
// // //   }]);
// // // });
// // router.get('/', function(req, res) {
// // 	if (req.session.username && req.session.username !== '') {
// // 	  res.json({logged: 'in'});
// // 	} else {
// // 	  res.json({logged: 'out'});
// // 	}
// // });



// // // router.post('/', function(req, res) {
// // // 	console.log(req.body);
// // //   username = req.body.username;
// // //   password = req.body.password;
// // //   User.checkIfLegit(username, password, function(err, isRight) {
// // //     if (err) {
// // //       res.send('Error! ' + err);
// // //     } else {
// // //       if (isRight) {
// // //         req.session.username = username;
// // //         res.json({logged: 'in'});
// // //         res.send('correct password');
// // //       } else {
// // //         res.send('wrong password');
// // //       }
// // //     }
// // //   });

// // // });


// router.get('/login', function(req, res) {
//   if (session.username && session.username !== '') {
//     res.json({register: false, logged: 'in'});
//   } else {
//     res.json({register: false, logged: 'out'});
//   }
// });

// router.post('/login', function(req, res) {
//   if (req.body.button === 'link') {
//     res.redirect('/books');
//   } else {
//     username = req.body.username;
//     password = req.body.password;
//     User.checkIfLegit(username, password, function(err, isRight) {
//       if (err) {
//         res.send(err);
//       } else {
//         if (isRight) {
//           session.username = username;
//           res.redirect('/login');
//         } else {
//           res.redirect('/login');
//         }
//       }
//     });
//   }
// });


// module.exports = router;

