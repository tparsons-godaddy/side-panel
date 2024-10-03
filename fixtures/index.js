

const difyHeader = [{
    "raw": true,
    "metric": "availability",
    "aggregations": [
        "hour",
        "poll_id.keyword"
    ],
    "size": 0,
    "filters": [
        {
            "field": "service",
            "value": 4188,
            "type": "term",
            "fieldType": "number"
        },
        {
            "field": "isStaged",
            "value": false,
            "type": "term",
            "fieldType": "boolean"
        }
    ],
    "startAt": "now-24h",
    "endAt": "now"
  },{
    "raw": true,
    "metric": "availability",
    "aggregations": [
      "day",
      "poll_id.keyword"
    ],
    "size": 0,
    "filters": [
      {
        "field": "service",
        "value": 4188, // Dify Header
        "type": "term",
        "fieldType": "number"
      },
      {
        "field": "isStaged",
        "value": false,
        "type": "term",
        "fieldType": "boolean"
      }
    ],
    "startAt": "now-1w",
    "endAt": "now"
}]

const difyRequest = [{
  "raw": true,
  "metric": "availability",
  "aggregations": [
      "hour",
      "poll_id.keyword"
  ],
  "size": 0,
  "filters": [
      {
          "field": "service",
          "value": 4353,
          "type": "term",
          "fieldType": "number"
      },
      {
          "field": "isStaged",
          "value": false,
          "type": "term",
          "fieldType": "boolean"
      }
  ],
  "startAt": "now-24h",
  "endAt": "now"
},
{
  "raw": true,
  "metric": "availability",
  "aggregations": [
      "day",
      "poll_id.keyword"
  ],
  "size": 0,
  "filters": [
      {
          "field": "service",
          "value": 4353,
          "type": "term",
          "fieldType": "number"
      },
      {
          "field": "isStaged",
          "value": false,
          "type": "term",
          "fieldType": "boolean"
      }
  ],
  "startAt": "now-1w",
  "endAt": "now"
}
]

const difyShared = [{
  "raw": true,
  "metric": "availability",
  "aggregations": [
      "hour",
      "poll_id.keyword"
  ],
  "size": 0,
  "filters": [
      {
          "field": "service",
          "value": 4355,
          "type": "term",
          "fieldType": "number"
      },
      {
          "field": "isStaged",
          "value": false,
          "type": "term",
          "fieldType": "boolean"
      }
  ],
  "startAt": "now-24h",
  "endAt": "now"
},
{
  "raw": true,
  "metric": "availability",
  "aggregations": [
      "day",
      "poll_id.keyword"
  ],
  "size": 0,
  "filters": [
      {
          "field": "service",
          "value": 4355,
          "type": "term",
          "fieldType": "number"
      },
      {
          "field": "isStaged",
          "value": false,
          "type": "term",
          "fieldType": "boolean"
      }
  ],
  "startAt": "now-1w",
  "endAt": "now"
}]

export { difyHeader, difyRequest, difyShared };
