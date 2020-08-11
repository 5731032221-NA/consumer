var amqp = require('amqplib/callback_api');
const request = require('request')
const CONN_URL = 'amqp://192.168.0.3';
amqp.connect(CONN_URL, function (err, conn) {
   if(err){
      //throw err;
     console.log(err)
   }
    conn.createChannel(function (err, ch) {
    ch.consume('JEFF', function (msg) {
      console.log('.....');
      setTimeout(function(){
        console.log("Message:", msg.content.toString());
        //get message content(body)
        let obj = msg.content.toString();
        console.log('obj : '+obj )
        //parse into JSON format
        var obj2 = JSON.parse(msg.content.toString());
        //Begin to request HTTP Post Method
        request.post('http://192.168.0.7:8204/checksubscribe', {
   //       request.post('http://192.168.0.7:8204/checksubscribe', {
		  
          json: obj2
       },
            (error, res, body) => {
             if(error) {
                console.error(error)
               return
            }
                console.log(`statusCode: ${res.statusCode}`)
                console.log(body)
                ch.ack(msg);
		 
            })
      },4000);
      },{ noAck: false }
    );
  });
});
