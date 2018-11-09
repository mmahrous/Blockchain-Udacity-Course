# BlockChain API

BlockChain web service, this service enable you to be programaticlly interface with our BlockChain.

## API specs
This uses hapijs https://hapijs.com and Joijs to validate the data.

## API documentation
This api is accessible through `HTTP` API endpoint `http://localhost:8000`

### Routes
### Get Block with height
```
GET /block/{height}
```
#### Params
```
height: is number
```
#### Response [200]
```JSON
{
    "height": 0,
    "timeStamp": "154179346335",
    "data": "First block in the chain - Genesis block",
    "previousHash": "0x",
    "hash": "4e1b401f1e7207629f1cc693e4e8b1dbb8ac3c48bd8c8b7e7afefed88bda9f0b"
}
```

#### Response [400]
Height is not a number
```JSON
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "block height is always a number.",
    "validation": {
        "source": "params",
        "keys": []
    }
}
```

#### Response [404]
Block is not present in the chains
```JSON
{
    "statusCode": 404,
    "error": "Not found",
    "message": "block not found."
}
```
----
### Create new block
```
POST /block
```
#### Payload
```JSON
{
	"body": "Hello block chain"
}
```
#### Response [201]
Block added to the chain.
```JSON
{
    "height": 1,
    "timeStamp": "154179458623",
    "data": "Hello block chain",
    "previousHash": "0445ce70dd2cf016ebfee40c5ea8619bdeedee49f1b8093ecce2c22780a988fe",
    "hash": "399ad7fc126321e60db1cc65ca00b72c87bad3c54f05e1aecb88f93c6b8195ee"
}
```

#### Response [400]
Body is not present
```JSON
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "body is required to consider it add it to the chain.",
    "validation": {
        "source": "payload",
        "keys": []
    }
}
```

----
Developed by M.Mahrous
