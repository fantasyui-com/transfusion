# transfusion
Minimalist framework for real-time data synchronization.

[demo](https://github.com/fantasyui-com/hurlyburly)

## Control Flow

## Scenarios

#### User Interaction Scenario: fill out a form and save data to server

1. [data-command](https://github.com/fantasyui-com/data-command) binds a button via --on click flag
2. [bogo](https://github.com/fantasyui-com/bogo) sends command down to server
3. [cuddlemuffin](https://github.com/fantasyui-com/cuddlemuffin) saves the object to disk, by creating a folder with object id, and json file with random filename inside it.
3. ws is used to send a packet to [bogo](https://github.com/fantasyui-com/bogo) on the client

#### Update UI Scenario: Get updated packets from server and update UI.

 1. [bogo](https://github.com/fantasyui-com/bogo) gets object via ws from the server
 2. [pookie](https://github.com/fantasyui-com/pookie) gets packet from bogo and filters it info branches of its tree.
 3. [enbuffer](https://github.com/fantasyui-com/enbuffer) will keep a view of data arriving through a branch.
 4. [atom-smasher](https://github.com/fantasyui-com/atom-smasher) will create a POJO plain old JavaScript Object (povered by Proxies)
 5. [reconcilers](https://github.com/fantasyui-com/reconcilers) will use data and html to update DOM.


## Ideas

Maybe use EJS and https://github.com/salesforce/secure-filters
