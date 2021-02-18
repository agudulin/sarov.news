var duplicatesIds = [];

db.feed.aggregate([
  {
    $group: {
      _id: { link: "$link" },
      dups: { "$addToSet": "$_id" },
      count: { "$sum": 1 }
    }
  }, {
    $match: { count: { "$gt": 1 } }
  }
], {
  allowDiskUse: true
}).forEach(function (doc) {
  doc.dups.shift();
  doc.dups.forEach(function (dupId) {
    duplicatesIds.push(dupId);
  })
})

printjson(duplicatesIds);

db.feed.remove({ _id:{$in:duplicatesIds} });
