import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { error } from "console";
const app = express();

function App() {
  const server = http.createServer(app);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended:true }));

  app.get('/',(req,res)=>{
    res.json({"name": "farshid koni"})
  })
  app.post('/signup',(req,res)=>{
    var errors = []
    var pattern = /^[a-z0-9]{1,}@[a-z0-9]{1,}\.[a-z]{1,}$/i
    if (!pattern.test(res.body.email) || res.body.password <6){
      if (!pattern.test(res.body.email)) {
        errors.push({key:"email",errorText:"فرمت ایمیل وارد شده صحیح نمی باشد"})
      }
      if (res.body.password <6){
        errors.push({key:"password",errorText:"طول پسوورد کمتر از 6 کاراکتر می باشد"})
      }
      res.status(400).json({errors:errors})

    }
    res.status(201).json(req.body)
  })

  server.listen(3000, () => {
    console.log("server running on 5000 port");
  });
}
export default App;
