import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { error } from "console";
import crypt from "crypto";
const app = express();
let users = [];
let data = [
  {
    id: 1,
    title: "sadelauef",
    price: "900,000",
    image:
      "https://scontent-hel3-1.xx.fbcdn.net/v/t1.6435-9/120747573_2465981907038822_7080171589313155317_n.jpg?stp=cp0_dst-jpg_e15_p320x320_q65&_nc_cat=109&ccb=1-7&_nc_sid=110474&_nc_ohc=049BJ40NJLIAX-Yn0BT&_nc_ht=scontent-hel3-1.xx&oh=00_AfDzg_hk4T6OknsYlh6CvzkAQJfGpwAj31C_Azbfaza6VA&oe=64E8850D",
  },
  {
    id: 2,
    title: "ghasempor",
    price: "600,000",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr_1LDcovCTCasVEOFICGIWmoijauwTV5Ddg&usqp=CAU",
  },
  {
    id: 3,
    title: "yazdani",
    price: "400,000",
    image:
      "https://yt3.googleusercontent.com/ehnCIyPERxtG__vRAo0GY4VaaeG7HZswoPAchFsHuu0TqMfxxIpBG3USrkaL5A9u-TghE2a07g=s900-c-k-c0x00ffffff-no-rj",
  },
];
let id = data.length;
function App() {
  const server = http.createServer(app);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.status(200).json({ data: data });
  });
  app.post("/add", (req, res) => {
    try {
      var errors = [];

      if (req.body.title.length < 1) {
        errors.push({
          key: "title",
          errorText: "عنوان به صورت اشتباه وارد شده است",
        });

        res.status(400).json({ errors: errors });
        return;
      }
      var price =
        req.body.price && req.body.price !== "" ? req.body.price : "0";
      var image = req.body.image && req.body.image !== "" ? req.body.image : "";
      data.push({
        id: id + 1,
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
      });
      id++;
      res.status(201).json({ data: data });
    } catch (e) {
      res.status(500).json([]);
    }
  });
  app.delete("/delete", (req, res) => {
    let data2 = data;
    data = data2.filter((d) => {
      return !(d.id == req.query.id);
    });
    res.status(201).json({ data: data });
  });
  app.patch("/update", (req, res) => {
    var errors = [];

    if (req.body.title.length < 1) {
      errors.push({
        key: "title",
        errorText: "عنوان به صورت اشتباه وارد شده است",
      });

      res.status(400).json({ errors: errors });
      return;
    }
    data.map((d) => {
      if (d.id == req.query.id) {
        d.title = req.body.title;
      }
    });
    res.status(200).json({ data: data });
  });
  app.post("/signup", (req, res) => {
    try {
      var errors = [];
      var pattern = /^[a-z0-9]{1,}@[a-z0-9]{1,}\.[a-z]{1,}$/i;
      if (!pattern.test(req.body.email) || req.body.password.length < 6) {
        if (!pattern.test(req.body.email)) {
          errors.push({
            key: "email",
            errorText: "فرمت ایمیل وارد شده صحیح نمی باشد",
          });
        }
        if (req.body.password.length < 6) {
          errors.push({
            key: "password",
            errorText: "طول پسوورد کمتر از 6 کاراکتر می باشد",
          });
        }
        res.status(400).json({ errors: errors });
        return;
      }
      var err = false;
      users.map((user) => {
        if (user.email === req.body.email) {
          err = true;
        }
      });
      if (err) {
        errors.push([
          { key: "email", errorText: "با این ایمیل قبلا ثبت نام کرده اید" },
        ]);
        res.status(400).json({ errors: errors });
        return;
      }
      users.push({
        email: req.body.email,
        password: req.body.password,
        token: "",
      });
      console.log(users);
      res.status(201).json(req.body);
    } catch (e) {
      res.status(500).json([]);
    }
  });
  app.post("/signin", (req, res) => {
    try {
      var errors = [];
      var pattern = /^[a-z0-9]{1,}@[a-z0-9]{1,}\.[a-z]{1,}$/i;
      if (!pattern.test(req.body.email) || req.body.password.length < 6) {
        if (!pattern.test(req.body.email)) {
          errors.push({
            key: "email",
            errorText: "فرمت ایمیل وارد شده صحیح نمی باشد",
          });
        }
        if (req.body.password.length < 6) {
          errors.push({
            key: "password",
            errorText: "طول پسوورد کمتر از 6 کاراکتر می باشد",
          });
        }
        res.status(400).json({ errors: errors });
        return;
      }
      var token = crypt
        .createHmac("sha256", Date.now + req.body.email)
        .digest("base64");
      var success = false;
      users.map((user) => {
        if (
          user.email === req.body.email &&
          user.password === req.body.password
        ) {
          user.token = token;
          success = true;
        }
      });
      if (!success) {
        res.status(403).json({ errorText: "کاربری یافت نشد" });
        return;
      }

      res.status(201).json({ token: token, tokenType: "bearer" });
    } catch (e) {
      res.status(500).json([]);
    }
  });
  server.listen(3000, () => {
    console.log("server running on 5000 port");
  });
}
export default App;
