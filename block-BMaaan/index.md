writeCode

Q1. Design database model using mongoose to replicate data structure of `STACK OVERFLOW` and add appropriate indexes to support the queries.

Stack Overflow consists of

- Users
- Questions
- Answers
- REPLY'S on Question/Answers
- Up/Down vote on Questions/Answers/Replies
- Tags on Questions
- Views on Questions
- Reputation for each user based on questions asked, answers given, upvotes

Design models for storing these data and associate them accordingly to fetch related data together.

Use indexes to support queries related to questions, tags etc..

```

let userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: {type: String, required: true},
    email: { type: String, unique: true },
    password: { type: String, minlength: 5, maxlength: 20 },
    reputation: { type: Number, default: 0 },
    questions: { type: [Schema.Types.ObjectId], ref: 'Question' },
    answers: { type: [Schema.Types.ObjectId], ref: 'Answer' },
  },
  {
    timestamps: true,
  }
);

let questionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    askedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 },
    tags: [String],
    views: { type: Number, default: 0 },
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
    answers: { type: [Schema.Types.ObjectId], ref: 'Answer' },
  },
  {
    timestamps: true,
  }
);

let answerSchema = new Schema(
  {
    content: { type: String, required: true },
    answeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionAnswered: { type: Schema.Types.ObjectId, ref: 'Question' },
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

let commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commentedTo: String,
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ title: 'text' });
questionSchema.index({ tags: 1 });

```

Q2. Use aggregation framework to

- Get array of all the tags used in the questions

```
db.questions.aggregate([ { $unwind: '$tags' }, { $group: { _id: '$tags' } }])
```

- Get total questions count

```
db.questions.aggregate([{$group: {_id:null, count: {$sum:1}}}])
```

- Total answers count overall and question specific as well

```
Total answers count:
db.answers.aggregate([{$group: {_id:null, count: {$sum:1}}}])

Question specific answer count:
db.questions.aggregate([{ $unwind: '$answers' },{$group: {_id:'$title', count: {$sum:1}}}])
```

- Count total reputation of a user

```
db.users.aggregate([{$group: {_id:null, count: {$sum: '$reputation'}}}])
```

- total views on a particular day

```
db.questions.aggregate([
    {$match:  {createdAt: {$eq: ISODate("2022-03-09T11:16:38.000Z")}}},
    {$group: {
        _id: null,
        count: {$sum: '$views'}
    }}
]);
```

- Count total answer by a particular user

```
db.users.aggregate([
      {$match: {username: 'sample'}},
      {$unwind: '$answers'},
      {$group: {
          _id: null,
          count: { $sum: 1}
      }}
])
```
