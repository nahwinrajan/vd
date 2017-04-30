var mongoose = require('mongoose');

var objectSchema = mongoose.Schema({
  objKey: {
    type: String,
    index: true,
    required: true,
    maxLength: 250, //limit possible edge case
    minLength: 1
  },
  objValue: {
    type: String,
    maxLength: 500, //limit possible edge case
    required: true
  },
  timestampUTC: {
    type: Number
  }
}, {
  timestamps: true
});

// schema hooks
objectSchema.pre('save', function objectPreSave(next) {
  let utcTimeInSeconds = Math.floor((new Date()).getTime()/1000);

  this.timestampUTC = utcTimeInSeconds;
  next();
});

// schema methods
objectSchema.statics.all = function objectGetAll(cb) {
  if (arguments.length < 1 || typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }

  return this.find({}, cb);
};

objectSchema.statics.findByKey = function objectFindByKey(paramKey, cb) {
  if (arguments.length < 2 || !paramKey || typeof paramKey !== 'string' ||
   typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }
  //only get the latest data
  return this.find({
    objKey: paramKey
  }).
  sort({timestampUTC: -1}).
  limit(1).
  exec(cb);
};

objectSchema.statics.findByKeyWithTimestamp = function objectFindByKeyWithTimestamp(paramKey, paramTimestamp, cb) {
  if (arguments.length < 3 || !paramKey || typeof paramKey !== 'string' ||
  !paramTimestamp || typeof paramTimestamp === 'number' || typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }

  return this.find({
    objKey: paramKey,
    timestampUTC: {
      $lte: paramTimestamp
    }
  }).
  sort({timestampUTC: -1}).
  limit(1).
  exec(cb);
};

module.exports = mongoose.model("Object", objectSchema);
