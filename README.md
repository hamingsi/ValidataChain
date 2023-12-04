what I need to implement:

struct Data {
        address Creater;
        address[] User;
        // 不能使用dataURI
        bytes32 dataHash;
        // 对数据进行验证 bool变量
        // 上传的是hash 保证数据没有发生改变 User在使用的时候直接比对就可以
        uint256 dataPrice;
        uint256 dataId;
        string dataDescribe;
    }

function:
1. CreateData // CreateData receive uri and price ✅
upload uri to api

2. CreateUser // choose which data(dataId) to use and pay price✅
require pay > price
update User

3. GetDataLength✅

4. GetDataUser✅
returns list

5. GetDataHash
use chainlink function service
return bytes32

6. GetDataDescribe✅

7. GetDataPrice //?✅
price to bonus
create a ticket pool to beneft everyone

7. chainlink function call any api function

modifier:
1. Creater of data ✅

2. User of data ✅

event:

1. CreaterCreated ✅

2. DataHashGenerated ✅

3. UserCreated 

4. 
// 链下进行的数据转移


need to update contract

update data onwer, data user, price, dataDescribe

transfer data onwer