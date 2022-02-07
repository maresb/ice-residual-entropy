class InvalidPointError extends Error {
    constructor(x, y, z) {
        super("Not a valid point: " + x + ", " + y + ", " + z);
    }
}

// JS has no modulo operator.
// https://stackoverflow.com/a/4467559
function mod(n, m) {
    return ((n % m) + m) % m;
}


class OxygenIh {
    static registry = {};
    static distances = {};
    static oxygensAtDistanceList = [];
    static facetNormals = [
        [6, 6, 6],
        [11, -1, -1],
        [-1, 11, -1],
        [-1, -1, 11],
        [-5, 7, 7],
        [7, -5, 7],
        [7, 7, -5],
        // negatives:
        [-6, -6, -6],
        [-11, 1, 1],
        [1, -11, 1],
        [1, 1, -11],
        [5, -7, -7],
        [-7, 5, -7],
        [-7, -7, 5],
    ];
    static skey(x, y, z) {
        return x + "," + y + "," + z;
    }
    ikey() {
        return this.constructor.skey(this.x, this.y, this.z);
    }
    static getInstance(x, y, z) {
        const reg = this.registry;
        const key = this.skey(x, y, z);
        if (key in reg) {
            return reg[key];
        }
        const pt = new this(x, y, z);
        reg[key] = pt;
        return pt;
    }
    oneThirdSum() {
        const sum = this.x + this.y + this.z;
        if (mod(sum, 3)) {
            throw new InvalidPointError(x, y, z);
        }
        return Math.trunc(sum / 3);
    }
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        const s = this.oneThirdSum();
        if (mod(s, 8) == 0) {
            if (mod(x - s, 6) + mod(y - s, 6) + mod(z - s, 6)) {
                throw new InvalidPointError(x, y, z);
            }
        } else if (mod(s, 8) == 1) {
            if (mod(x - s - 2, 6) + mod(y - s - 2, 6) + mod(z - s - 2, 6)) {
                throw new InvalidPointError(x, y, z);
            }
        } else if (mod(s, 8) == 4) {
            if (mod(x - s - 2, 6) + mod(y - s - 2, 6) + mod(z - s - 2, 6)) {
                throw new InvalidPointError(x, y, z);
            }
        } else if (mod(s, 8) == 5) {
            if (mod(x - s, 6) + mod(y - s, 6) + mod(z - s, 6)) {
                throw new InvalidPointError(x, y, z);
            }
        } else {
            throw new InvalidPointError(x, y, z);
        }
    };
    neighbors() {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const s = this.oneThirdSum();
        const cls = this.constructor
        if (mod(s, 8) == 0) {
            return [
                cls.getInstance(x - 3, y - 3, z - 3),
                cls.getInstance(x - 3, y + 3, z + 3),
                cls.getInstance(x + 3, y - 3, z + 3),
                cls.getInstance(x + 3, y + 3, z - 3),
            ];
        }
        if (mod(s, 8) == 1) {
            return [
                cls.getInstance(x + 3, y + 3, z + 3),
                cls.getInstance(x + 3, y - 3, z - 3),
                cls.getInstance(x - 3, y + 3, z - 3),
                cls.getInstance(x - 3, y - 3, z + 3),
            ];
        }
        if (mod(s, 8) == 4) {
            return [
                cls.getInstance(x - 3, y - 3, z - 3),
                cls.getInstance(x + 5, y - 1, z - 1),
                cls.getInstance(x - 1, y + 5, z - 1),
                cls.getInstance(x - 1, y - 1, z + 5),
            ];
        }
        if (mod(s, 8) == 5) {
            return [
                cls.getInstance(x + 3, y + 3, z + 3),
                cls.getInstance(x - 5, y + 1, z + 1),
                cls.getInstance(x + 1, y - 5, z + 1),
                cls.getInstance(x + 1, y + 1, z - 5),
            ];
        }
        throw new Error("Inconsistent modulo 8");
    }
    graphDistance() {
        const cls = this.constructor
        const key = this.ikey();
        if (key in cls.distances) {
            return cls.distances[key];
        }
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const normals = this.constructor.facetNormals;
        const dots = normals.map(n => n[0] * x + n[1] * y + n[2] * z);
        // If not every element of dots is divisible by 3, then raise an error.
        if (dots.some(d => mod(d, 3))) {
            throw new Error("Inconsistent modulo 3");
        }
        const dot = Math.max(...dots) / 3;
        const r = mod(dot + 4, 24);
        const q = (dot + 4 - r) / 24;
        let res = 2 * q;
        if (r >= 9) {
            res++;
        }
        cls.distances[key] = res;
        return res;
    }
    static getOxygensAtDistance(distance) {
        const lst = this.oxygensAtDistanceList;
        while (lst.length <= distance) {
            const s = new Set();
            if (lst.length == 0) {
                s.add(this.getInstance(0, 0, 0));
            } else {
                for (const node of lst[lst.length - 1]) {
                    for (const neighbor of node.neighbors()) {
                        if (neighbor.graphDistance() == lst.length) {
                            s.add(neighbor);
                        }
                    }
                }
            }
            lst.push(s);
        }
        return lst[distance];
    }
}


class OxygenIc {
    static registry = {};
    static distances = {};
    static oxygensAtDistanceList = [];
    static facetNormals = [
        [2, 0, 0],
        [0, 2, 0],
        [0, 0, 2],
        [1, 1, 1],
        [-1, 1, 1],
        [1, -1, 1],
        [1, 1, -1],
        // negatives:
        [-2, 0, 0],
        [0, -2, 0],
        [0, 0, -2],
        [-1, -1, -1],
        [1, -1, -1],
        [-1, 1, -1],
        [-1, -1, 1],
    ];
    static skey(x, y, z) {
        return x + "," + y + "," + z;
    }
    ikey() {
        return this.constructor.skey(this.x, this.y, this.z);
    }
    static getInstance(x, y, z) {
        const reg = this.registry;
        const key = this.skey(x, y, z);
        if (key in reg) {
            return reg[key];
        }
        const pt = new this(x, y, z);
        reg[key] = pt;
        return pt;
    }
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        const s = x + y + z;
        if (mod(s, 12) == 0) {
            if (mod(x, 6) + mod(y, 6) + mod(z, 6)) {
                throw new InvalidPointError(x, y, z);
            }
        } else if (mod(s, 12) == 3) {
            if (mod(x - 3, 6) + mod(y - 3, 6) + mod(z - 3, 6)) {
                throw new InvalidPointError(x, y, z);
            }
        } else {
            throw new InvalidPointError(x, y, z);
        }
    };
    neighbors() {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const s = x + y + z;
        const cls = this.constructor
        if (mod(s, 12) == 0) {
            return [
                cls.getInstance(x - 3, y - 3, z - 3),
                cls.getInstance(x - 3, y + 3, z + 3),
                cls.getInstance(x + 3, y - 3, z + 3),
                cls.getInstance(x + 3, y + 3, z - 3),
            ];
        }
        if (mod(s, 12) == 3) {
            return [
                cls.getInstance(x + 3, y + 3, z + 3),
                cls.getInstance(x + 3, y - 3, z - 3),
                cls.getInstance(x - 3, y + 3, z - 3),
                cls.getInstance(x - 3, y - 3, z + 3),
            ];
        }
        throw new Error("Inconsistent modulo 12");
    }
    graphDistance() {
        const cls = this.constructor
        const key = this.ikey();
        if (key in cls.distances) {
            return cls.distances[key];
        }
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const normals = this.constructor.facetNormals;
        const dots = normals.map(n => n[0] * x + n[1] * y + n[2] * z);
        // If not every element of dots is divisible by 3, then raise an error.
        if (dots.some(d => mod(d, 3))) {
            throw new Error("Inconsistent modulo 3");
        }
        const dot = Math.max(...dots) / 3;
        const r = mod(dot, 4);
        const q = (dot - r) / 4;
        let res = 2 * q;
        if (r >= 1) {
            res++;
        }
        cls.distances[key] = res;
        return res;
    }
    static getOxygensAtDistance(distance) {
        const lst = this.oxygensAtDistanceList;
        while (lst.length <= distance) {
            const s = new Set();
            if (lst.length == 0) {
                s.add(this.getInstance(0, 0, 0));
            } else {
                for (const node of lst[lst.length - 1]) {
                    for (const neighbor of node.neighbors()) {
                        if (neighbor.graphDistance() == lst.length) {
                            s.add(neighbor);
                        }
                    }
                }
            }
            lst.push(s);
        }
        return lst[distance];
    }
}


const OxygenArray = function(...array) {
    const self = Array.from(...array)
    index = {}
    self.index = index
    for(const i of Array(self.length).keys()) {
        index[self[i].ikey()] = i;
    }
    self.location = oxygen => {
        return self.index[oxygen.ikey()];
    };
    self.neighborLocations = oxygen => {
        const neighbors = oxygen.neighbors();
        return neighbors.map(n => self.location(n));
    };
    return self;
}


// class OxygenArray extends Array {
//     constructor(...args) {
//         super(...args);
//         this.index = {};
//         for (let i = 0; i < args.length; i++) {
//             this.index[args[i].ikey()] = i;
//         }
//     }
//     location(oxygen) {
//         return this.index[oxygen.ikey()];
//     }
//     neighborLocations(oxygen) {
//         const neighbors = oxygen.neighbors();
//         return neighbors.map(n => this.location(n));
//     }
//     get(key) {
//         return this[this.index[key]];
//     }
//     has(key) {
//         return key in this.index;
//     }
//     // // Shadow Array.prototype methods:
//     // filter(...args) {
//     //     return new OxygenArray(
//     //         ...super.filter.apply(this, ...args)
//     //     );
//     // }
//     map(...args) {
//         const map = super.map;
//         return map.apply(this, args);
//     }
// }

let Oxygen = OxygenIh

function* oxygensWithDistanceLessThan(distance) {
    for (const d of Array(distance).keys()) {
        for (const oxygen of Oxygen.getOxygensAtDistance(d)) {
            yield oxygen;
        }
    }
}


o = Oxygen.getInstance(0, 0, 0);
n = o.neighbors()[0];
o2 = Oxygen.getInstance(-3, -3, -3)
o2.graphDistance()
console.log("Hello world")


newLayer = new Set();
newLayer.add(o);
const oxygenAtDistance = [newLayer];

console.log(Oxygen.getOxygensAtDistance(10).size);

const a0 = Array(...oxygensWithDistanceLessThan(8))

const a = OxygenArray(a0);

// const atoms = a.map(oxy =>
//     ({ elem: 'O', x: oxy.x, y: oxy.y, z: oxy.z, bonds: a.neighborLocations(oxy) })
// );


function atomsDistanceLessThan(n) {
    const atomArray = OxygenArray(Array(...oxygensWithDistanceLessThan(n)));
    return atomArray.map(oxy =>
        ({ 
            elem: 'O',
            x: oxy.x, y: oxy.y, z: oxy.z,
            bonds: atomArray.neighborLocations(oxy),
            color: (oxy.graphDistance() % 2 ? "green" : "red"),
            size: 2,
        })
    );
}



// var atomsByLayer = [[[0, 0, 0]]];

// function addLayer() {
//     numLayers = atomsByLayer.length;
//     nextLayer = []
//     currentLayer = atomsByLayer[numLayers - 1];
//     if (numLayers == 1) {
//         previousLayer = [];
//     } else {
//         previousLayer = atomsByLayer[numLayers - 2];
//     }
// }