var amqp = require('amqplib/callback_api');
const request = require('request')
//const CONN_URL = 'amqp://172.17.0.21';
amqp.connect('amqp://192.168.0.3', function (err, conn) {
   if(err){
      //throw err;
   }
    console.log('hello')
    conn.createChannel(function (err, ch) {
	  console.log('hi')
    //ch.assertQueue('VISA', { durable: false });
	ch.consume('VISA', function (msg) {
      console.log('.....');
      setTimeout(function(){
        //console.log("Message:", msg.content.toString());
        //get message content(body)
        let obj = msg.content.toString();
        //console.log('obj : '+obj )
        //parse into JSON format
        var obj2 = JSON.parse(msg.content.toString());
        //Begin to request HTTP Post Method
	//obj2.RETRY = 1;
	   console.log(obj2)
	      //try{
       // request.post('http://172.17.0.27:8209/callevs', {
	      
        request({url:'http://192.168.0.9:8209/callevs',
		method: "POST",
		json: true,
		  body: obj2
          //json: obj2
       }
           , function(err, res, body) {
            if (err) {
                console.log(err)
               return
            }
                console.log(`statusCode: ${res.statusCode}`)
                console.log(body)
                ch.ack(msg);
            }) 
	      //}catch(err){console.log("errr",err.stack)} 
      },4000);
      },{ noAck: false }
    );
  });
});
