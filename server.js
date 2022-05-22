import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const port = 3001;
const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded('.views'));
app.use(express.static('./views'))
app.use(express.urlencoded({ extended: true }))

const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.3.1')
await client.connect();
const db = client.db('club')
const allMembers = db.collection('members');




app.get('/members', async (req, res) => {
  let members = await allMembers.find({}).toArray()
  
  res.render('members', { members,
  header: "Members" });
});


app.get('/member/:id' , async (req, res) => {
  const member = await allMembers.findOne({ _id: ObjectId(req.params.id)  });
   res.render('member', {
    header: "Member",
    name: member.name,
    breed: member.breed,
    mail: member.mail,
    phonenumber: member.phonenumber,
    joined: member.joined ? member.joined.toDateString() : '',
    _id: member._id
  })
});

app.get("/members/sortAtoZ", async (req, res) => {
  let members = await allMembers.find({}, {'name': 1}).sort({name: 1}).toArray();
 
  res.render('members', { members,
  header: "Members",
  }) 
});
app.get("/members/sortZtoA", async (req, res) => {
  let members = await allMembers.find({}, {'name': -1}).sort({name: -1}).toArray();
 
  res.render('members', { members,
  header: "Members",
  }) 
});

app.post('/member/delete/:id' , async(req, res) => {
 await allMembers.deleteOne({ _id: ObjectId(req.params.id)})
  res.redirect('/members')
})


app.get('/create', (req, res) => {
  res.render('create', {
    header: "New member"
  })
});

app.post('/members/create', async (req, res) => {
  await allMembers.insertOne({
    ...req.body,
    joined: new Date()
  });
  res.redirect('/members')
});


app.get('/start', (req, res) => {
  res.render('start', {
    header: "DogClub"
  })
})


app.post('/member/:id/update', async (req, res) => {

  const member = await allMembers.updateOne({ _id: ObjectId(req.params.id) }, { $set: (req.body) });

  res.redirect(`/member/${req.params.id}`);

})

app.listen(port, () => console.log(`Listening on port ${port}`));