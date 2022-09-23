# srsm

#### simple react state management

# Install

##### npm

```bash
npm install srsm
```

##### yarn

```bash
yarn add srsm
```

# Import

```js
import srsm from "srsm";
```

# Init

```js
srsm.init(React, require('eventemitter3'));
```

# Create

##### create store with default value

```js
const OnlineEvent = srsm({
    online: false
})
```

##### create store with type and default value

```js
const RouterEvent = srsm < {
    value: "login" | "signup" | "home",
} > ({
    value: "login",
});
```

##### create store with type and default value and render function

```js
const CounterEvent = srsm < {
    count: number
} > ({
    count: 10,
}, () => {
    return <h1>{CounterEvent.count}</h1>
});
```

# Event.xxx

##### Event.xxx can change the value of the store

```js
CounterEvent.count += 1;
```

# Event.listener

##### Event.listener is a function that can listen to the change of the store

```js
const RootComponent = () => {
    RouterEvent.listener();
    if (RouterEvent.value === "login") {
        return <>login</>
    }
    if (RouterEvent.value === "signup") {
        return <>signup</>
    }
    return <>home</>
};
```

# Event.component

##### Event.component is a function that can listen to the change of the store and render the component

```js
const RootComponent = () => {
    return <>
        <CounterEvent.component/>
    </>
};
```

# Event.emit

## emit(callback)

##### Automatically refresh components after modifying data

```js
CounterEvent.emit((data) => {
    data.count -= 1;
});
```

## emit()

##### Refresh one or more same components

```js
ItemEvent.emit();
```

## emit(_Key : number | string)

##### update component by _Key

```js
const ListEvent = srsm({
    data: [{
        index: 0,
        text: "text 0"
    }, {
        index: 1,
        text: "text 1"
    }, {
        index: 2,
        text: "text 2"
    }],
}, () => {
    return <div>
        {ListEvent.data.map((item, index) => {
            //bind component by keyword _key
            return <ItemEvent.component key={index} _key={index}/>
        })}
        <ControllerComponent/>
    </div>
});
```

##### Update second item

```js
ListEvent.data[1].text = "new data";
ItemEvent.emit(1);
```

# Confuse

### they function the same, no performance difference

```js
CounterEvent.count += 1;
CounterEvent.emit();
```

```js
CounterEvent.emit((data) => {
    data.count += 1;
});
```

```js
CounterEvent.emit(() => {
    CounterEvent.count += 1;
});
```

### About react props, It is recommended to use Event.xxx, and props should try to pass similar id data

```js
export const LoginEvent = CreateEvent({
    visibility: false,
    username: 'admin',
    password: '123456',
}, () => {
    return <div style={{display: LoginEvent.visibility ? "flex" : "none"}}>
        <div>
            <input value={LoginEvent.username} onChange={(e) => {
                LoginEvent.emit((data) => {
                    data.username = e.target.value
                })
            }}/>
        </div>
        <div>
            <input value={LoginEvent.password} onChange={(e) => {
                LoginEvent.emit((data) => {
                    data.password = e.target.value
                })
            }}/>
        </div>
    </div>
});
```

# Complete Example

### Counter Example

```js
import React from 'react';
import ReactDOM from "react-dom/client";
import srsm from "srsm";


const CounterEvent = srsm({
    count: 10,
}, () => {
    return <h1>{CounterEvent.count} </h1>
});


const increase = () => {
    CounterEvent.count += 1;
    CounterEvent.emit();
}
const decrease = () => {
    CounterEvent.emit((data) => {
        data.count -= 1;
    });
}
const reset = () => {
    CounterEvent.emit(() => {
        CounterEvent.count = 10;
    });
}
const RootComponent = () => {
    return <>
        <CounterEvent.component/>
        <h2>
            <button onClick={increase}>+</button>
        </h2>
        <h2>
            <button onClick={decrease}>-</button>
        </h2>
        <h2>
            <button onClick={reset}>rest</button>
        </h2>
    </>
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RootComponent/>);
```

### Loop Example

```js
import React from 'react';
import ReactDOM from "react-dom/client";
import srsm from "srsm";


const ListEvent = srsm < {
    data: {index: number, text: string}[],
} > ({
    data: [{
        index: 0,
        text: "text 0"
    }, {
        index: 1,
        text: "text 1"
    }, {
        index: 2,
        text: "text 2"
    }, {
        index: 3,
        text: "text 3"
    }, {
        index: 4,
        text: "text 4"
    }],
}, () => {
    return <div>
        {ListEvent.data.map((item, index) => {
            return <ItemEvent.component key={index} _key={index}/>
        })}
        <ControllerComponent/>
    </div>
});

const ItemEvent = srsm((props: { _key: number }) => {
    const item = ListEvent.data[props._key];
    return <div>
        <h3>{item.text}</h3>
    </div>
});


const ControllerComponent = () => {
    return <div>
        <h2 onClick={() => {
            ListEvent.data[1].text = "22222";
            ItemEvent.emit(1);
        }}>Modify the text of element 2
        </h2>
        <h2 onClick={() => {
            ListEvent.data[2].text = "33333";
            ItemEvent.emit(2);
        }}>Modify the text of element 3
        </h2>
        <h2 onClick={() => {
            ListEvent.data = [{
                index: 0,
                text: "text 0"
            }, {
                index: 1,
                text: "text 1"
            }, {
                index: 2,
                text: "text 2"
            }, {
                index: 3,
                text: "text 3"
            }, {
                index: 4,
                text: "text 4"
            }];
            ListEvent.emit();
        }}>reset via ListEvent
        </h2>
        <h2 onClick={() => {
            ListEvent.data = [{
                index: 0,
                text: "text 0"
            }, {
                index: 1,
                text: "text 1"
            }, {
                index: 2,
                text: "text 2"
            }, {
                index: 3,
                text: "text 3"
            }, {
                index: 4,
                text: "text 4"
            }];
            ItemEvent.emit();
        }}>reset via ListEvent
        </h2>
    </div>
};


const RootComponent = () => {
    return <>
        <ListEvent.component/>
    </>
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RootComponent/>);
```