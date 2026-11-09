// agents/omp.js
import { fileURLToPath } from "node:url";

// output-es/runtime.js
function binding(init) {
  let state = 0;
  let value;
  return () => {
    if (state === 2) {
      return value;
    }
    if (state === 1) {
      throw new Error("Binding demanded before initialized");
    }
    state = 1;
    value = init();
    state = 2;
    return value;
  };
}
function fail() {
  throw new Error("Failed pattern match");
}
function intDiv(x, y) {
  if (y > 0)
    return Math.floor(x / y);
  if (y < 0)
    return -Math.floor(x / -y);
  return 0;
}

// output-es/Record.Unsafe/foreign.js
var unsafeGet = function(label) {
  return function(rec) {
    return rec[label];
  };
};
// output-es/Type.Proxy/index.js
var $$$Proxy = () => ({ tag: "Proxy" });
var $$Proxy = /* @__PURE__ */ $$$Proxy();

// output-es/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};
var showStringImpl = function(s) {
  var l = s.length;
  return '"' + s.replace(/[\0-\x1F\x7F"\\]/g, function(c, i) {
    switch (c) {
      case '"':
      case "\\":
        return "\\" + c;
      case "\x07":
        return "\\a";
      case "\b":
        return "\\b";
      case "\f":
        return "\\f";
      case `
`:
        return "\\n";
      case "\r":
        return "\\r";
      case "\t":
        return "\\t";
      case "\v":
        return "\\v";
    }
    var k = i + 1;
    var empty = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
    return "\\" + c.charCodeAt(0).toString(10) + empty;
  }) + '"';
};
// output-es/Data.Show/index.js
var showInt = { show: showIntImpl };

// output-es/Data.Ordering/index.js
var $Ordering = (tag) => tag;
var LT = /* @__PURE__ */ $Ordering("LT");
var GT = /* @__PURE__ */ $Ordering("GT");
var EQ = /* @__PURE__ */ $Ordering("EQ");

// output-es/Data.Maybe/index.js
var $Maybe = (tag, _1) => ({ tag, _1 });
var Nothing = /* @__PURE__ */ $Maybe("Nothing");
var Just = (value0) => $Maybe("Just", value0);
var isNothing = (v2) => {
  if (v2.tag === "Nothing") {
    return true;
  }
  if (v2.tag === "Just") {
    return false;
  }
  fail();
};
var isJust = (v2) => {
  if (v2.tag === "Nothing") {
    return false;
  }
  if (v2.tag === "Just") {
    return true;
  }
  fail();
};
var functorMaybe = {
  map: (v) => (v1) => {
    if (v1.tag === "Just") {
      return $Maybe("Just", v(v1._1));
    }
    return Nothing;
  }
};

// output-es/Data.Either/index.js
var $Either = (tag, _1) => ({ tag, _1 });
var Left = (value0) => $Either("Left", value0);
var Right = (value0) => $Either("Right", value0);

// output-es/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0;i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};
// output-es/Data.Functor/index.js
var functorArray = { map: arrayMap };

// output-es/Control.Apply/foreign.js
var arrayApply = function(fs) {
  return function(xs) {
    var l = fs.length;
    var k = xs.length;
    var result = new Array(l * k);
    var n = 0;
    for (var i = 0;i < l; i++) {
      var f = fs[i];
      for (var j = 0;j < k; j++) {
        result[n++] = f(xs[j]);
      }
    }
    return result;
  };
};

// output-es/Control.Apply/index.js
var identity = (x) => x;
var applyArray = { apply: arrayApply, Functor0: () => functorArray };

// output-es/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init) {
    return function(xs) {
      var acc = init;
      var len = xs.length;
      for (var i = len - 1;i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init) {
    return function(xs) {
      var acc = init;
      var len = xs.length;
      for (var i = 0;i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};
// output-es/Data.Foldable/index.js
var traverse_ = (dictApplicative) => {
  const $0 = dictApplicative.Apply0();
  return (dictFoldable) => (f) => dictFoldable.foldr((x) => {
    const $1 = f(x);
    return (b) => $0.apply($0.Functor0().map((v) => identity)($1))(b);
  })(dictApplicative.pure());
};
var for_ = (dictApplicative) => {
  const traverse_1 = traverse_(dictApplicative);
  return (dictFoldable) => {
    const $0 = traverse_1(dictFoldable);
    return (b) => (a) => $0(a)(b);
  };
};
var foldableMaybe = {
  foldr: (v) => (v1) => (v2) => {
    if (v2.tag === "Nothing") {
      return v1;
    }
    if (v2.tag === "Just") {
      return v(v2._1)(v1);
    }
    fail();
  },
  foldl: (v) => (v1) => (v2) => {
    if (v2.tag === "Nothing") {
      return v1;
    }
    if (v2.tag === "Just") {
      return v(v1)(v2._1);
    }
    fail();
  },
  foldMap: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (v) => (v1) => {
      if (v1.tag === "Nothing") {
        return mempty;
      }
      if (v1.tag === "Just") {
        return v(v1._1);
      }
      fail();
    };
  }
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (f) => foldableArray.foldr((x) => (acc) => dictMonoid.Semigroup0().append(f(x))(acc))(mempty);
  }
};

// output-es/Data.Nullable/foreign.js
var nullImpl = null;
function nullable(a, r, f) {
  return a == null ? r : f(a);
}
function notNull(x) {
  return x;
}
// output-es/Data.Nullable/index.js
var showNullable = (dictShow) => ({
  show: (x) => {
    const $0 = nullable(x, Nothing, Just);
    if ($0.tag === "Nothing") {
      return "null";
    }
    if ($0.tag === "Just") {
      return dictShow.show($0._1);
    }
    fail();
  }
});

// output-es/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};
// output-es/Effect/index.js
var applyEffect = {
  apply: (f) => (a) => () => {
    const f$p = f();
    const a$p = a();
    return applicativeEffect.pure(f$p(a$p))();
  },
  Functor0: () => functorEffect
};
var applicativeEffect = { pure: pureE, Apply0: () => applyEffect };
var functorEffect = {
  map: (f) => (a) => () => {
    const a$p = a();
    return f(a$p);
  }
};

// output-es/Effect.Exception/foreign.js
function error(msg) {
  return new Error(msg);
}
function message(e) {
  return e.message;
}
function throwException(e) {
  return function() {
    throw e;
  };
}
function catchException(c) {
  return function(t) {
    return function() {
      try {
        return t();
      } catch (e) {
        if (e instanceof Error || Object.prototype.toString.call(e) === "[object Error]") {
          return c(e)();
        } else {
          return c(new Error(e.toString()))();
        }
      }
    };
  };
}
// output-es/Control.Monad.Error.Class/index.js
var $$try = (dictMonadError) => {
  const Monad0 = dictMonadError.MonadThrow0().Monad0();
  return (a) => dictMonadError.catchError(Monad0.Bind1().Apply0().Functor0().map(Right)(a))((x) => Monad0.Applicative0().pure($Either("Left", x)));
};

// output-es/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};
// output-es/Unsafe.Coerce/foreign.js
var unsafeCoerce = function(x) {
  return x;
};
// output-es/Effect.Aff/foreign.js
var Aff = function() {
  var EMPTY = {};
  var PURE = "Pure";
  var THROW = "Throw";
  var CATCH = "Catch";
  var SYNC = "Sync";
  var ASYNC = "Async";
  var BIND = "Bind";
  var BRACKET = "Bracket";
  var FORK = "Fork";
  var SEQ = "Sequential";
  var MAP = "Map";
  var APPLY = "Apply";
  var ALT = "Alt";
  var CONS = "Cons";
  var RESUME = "Resume";
  var RELEASE = "Release";
  var FINALIZER = "Finalizer";
  var FINALIZED = "Finalized";
  var FORKED = "Forked";
  var FIBER = "Fiber";
  var THUNK = "Thunk";
  function Aff(tag, _1, _2, _3) {
    this.tag = tag;
    this._1 = _1;
    this._2 = _2;
    this._3 = _3;
  }
  function AffCtr(tag) {
    var fn = function(_1, _2, _3) {
      return new Aff(tag, _1, _2, _3);
    };
    fn.tag = tag;
    return fn;
  }
  function nonCanceler(error) {
    return new Aff(PURE, undefined);
  }
  function runEff(eff) {
    try {
      eff();
    } catch (error) {
      setTimeout(function() {
        throw error;
      }, 0);
    }
  }
  function runSync(left, right, eff) {
    try {
      return right(eff());
    } catch (error) {
      return left(error);
    }
  }
  function runAsync(left, eff, k) {
    try {
      return eff(k)();
    } catch (error) {
      k(left(error))();
      return nonCanceler;
    }
  }
  var Scheduler = function() {
    var limit = 1024;
    var size = 0;
    var ix = 0;
    var queue = new Array(limit);
    var draining = false;
    function drain() {
      var thunk;
      draining = true;
      while (size !== 0) {
        size--;
        thunk = queue[ix];
        queue[ix] = undefined;
        ix = (ix + 1) % limit;
        thunk();
      }
      draining = false;
    }
    return {
      isDraining: function() {
        return draining;
      },
      enqueue: function(cb) {
        var i, tmp;
        if (size === limit) {
          tmp = draining;
          drain();
          draining = tmp;
        }
        queue[(ix + size) % limit] = cb;
        size++;
        if (!draining) {
          drain();
        }
      }
    };
  }();
  function Supervisor(util) {
    var fibers = {};
    var fiberId = 0;
    var count = 0;
    return {
      register: function(fiber) {
        var fid = fiberId++;
        fiber.onComplete({
          rethrow: true,
          handler: function(result) {
            return function() {
              count--;
              delete fibers[fid];
            };
          }
        })();
        fibers[fid] = fiber;
        count++;
      },
      isEmpty: function() {
        return count === 0;
      },
      killAll: function(killError, cb) {
        return function() {
          if (count === 0) {
            return cb();
          }
          var killCount = 0;
          var kills = {};
          function kill(fid) {
            kills[fid] = fibers[fid].kill(killError, function(result) {
              return function() {
                delete kills[fid];
                killCount--;
                if (util.isLeft(result) && util.fromLeft(result)) {
                  setTimeout(function() {
                    throw util.fromLeft(result);
                  }, 0);
                }
                if (killCount === 0) {
                  cb();
                }
              };
            })();
          }
          for (var k in fibers) {
            if (fibers.hasOwnProperty(k)) {
              killCount++;
              kill(k);
            }
          }
          fibers = {};
          fiberId = 0;
          count = 0;
          return function(error) {
            return new Aff(SYNC, function() {
              for (var k in kills) {
                if (kills.hasOwnProperty(k)) {
                  kills[k]();
                }
              }
            });
          };
        };
      }
    };
  }
  var SUSPENDED = 0;
  var CONTINUE = 1;
  var STEP_BIND = 2;
  var STEP_RESULT = 3;
  var PENDING = 4;
  var RETURN = 5;
  var COMPLETED = 6;
  function Fiber(util, supervisor, aff) {
    var runTick = 0;
    var status = SUSPENDED;
    var step = aff;
    var fail = null;
    var interrupt = null;
    var bhead = null;
    var btail = null;
    var attempts = null;
    var bracketCount = 0;
    var joinId = 0;
    var joins = null;
    var rethrow = true;
    function run(localRunTick) {
      var tmp, result, attempt;
      while (true) {
        tmp = null;
        result = null;
        attempt = null;
        switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            try {
              step = bhead(step);
              if (btail === null) {
                bhead = null;
              } else {
                bhead = btail._1;
                btail = btail._2;
              }
            } catch (e) {
              status = RETURN;
              fail = util.left(e);
              step = null;
            }
            break;
          case STEP_RESULT:
            if (util.isLeft(step)) {
              status = RETURN;
              fail = step;
              step = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step = util.fromRight(step);
            }
            break;
          case CONTINUE:
            switch (step.tag) {
              case BIND:
                if (bhead) {
                  btail = new Aff(CONS, bhead, btail);
                }
                bhead = step._2;
                status = CONTINUE;
                step = step._1;
                break;
              case PURE:
                if (bhead === null) {
                  status = RETURN;
                  step = util.right(step._1);
                } else {
                  status = STEP_BIND;
                  step = step._1;
                }
                break;
              case SYNC:
                status = STEP_RESULT;
                step = runSync(util.left, util.right, step._1);
                break;
              case ASYNC:
                status = PENDING;
                step = runAsync(util.left, step._1, function(result) {
                  return function() {
                    if (runTick !== localRunTick) {
                      return;
                    }
                    runTick++;
                    Scheduler.enqueue(function() {
                      if (runTick !== localRunTick + 1) {
                        return;
                      }
                      status = STEP_RESULT;
                      step = result;
                      run(runTick);
                    });
                  };
                });
                return;
              case THROW:
                status = RETURN;
                fail = util.left(step._1);
                step = null;
                break;
              case CATCH:
                if (bhead === null) {
                  attempts = new Aff(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff(CONS, step, new Aff(CONS, new Aff(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step = step._1;
                break;
              case BRACKET:
                bracketCount++;
                if (bhead === null) {
                  attempts = new Aff(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff(CONS, step, new Aff(CONS, new Aff(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step = step._1;
                break;
              case FORK:
                status = STEP_RESULT;
                tmp = Fiber(util, supervisor, step._2);
                if (supervisor) {
                  supervisor.register(tmp);
                }
                if (step._1) {
                  tmp.run();
                }
                step = util.right(tmp);
                break;
              case SEQ:
                status = CONTINUE;
                step = sequential(util, supervisor, step._1);
                break;
            }
            break;
          case RETURN:
            bhead = null;
            btail = null;
            if (attempts === null) {
              status = COMPLETED;
              step = interrupt || fail || step;
            } else {
              tmp = attempts._3;
              attempt = attempts._1;
              attempts = attempts._2;
              switch (attempt.tag) {
                case CATCH:
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    status = RETURN;
                  } else if (fail) {
                    status = CONTINUE;
                    step = attempt._2(util.fromLeft(fail));
                    fail = null;
                  }
                  break;
                case RESUME:
                  if (interrupt && interrupt !== tmp && bracketCount === 0 || fail) {
                    status = RETURN;
                  } else {
                    bhead = attempt._1;
                    btail = attempt._2;
                    status = STEP_BIND;
                    step = util.fromRight(step);
                  }
                  break;
                case BRACKET:
                  bracketCount--;
                  if (fail === null) {
                    result = util.fromRight(step);
                    attempts = new Aff(CONS, new Aff(RELEASE, attempt._2, result), attempts, tmp);
                    if (interrupt === tmp || bracketCount > 0) {
                      status = CONTINUE;
                      step = attempt._3(result);
                    }
                  }
                  break;
                case RELEASE:
                  attempts = new Aff(CONS, new Aff(FINALIZED, step, fail), attempts, interrupt);
                  status = CONTINUE;
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    step = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                  } else if (fail) {
                    step = attempt._1.failed(util.fromLeft(fail))(attempt._2);
                  } else {
                    step = attempt._1.completed(util.fromRight(step))(attempt._2);
                  }
                  fail = null;
                  bracketCount++;
                  break;
                case FINALIZER:
                  bracketCount++;
                  attempts = new Aff(CONS, new Aff(FINALIZED, step, fail), attempts, interrupt);
                  status = CONTINUE;
                  step = attempt._1;
                  break;
                case FINALIZED:
                  bracketCount--;
                  status = RETURN;
                  step = attempt._1;
                  fail = attempt._2;
                  break;
              }
            }
            break;
          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step));
              }
            }
            joins = null;
            if (interrupt && fail) {
              setTimeout(function() {
                throw util.fromLeft(fail);
              }, 0);
            } else if (util.isLeft(step) && rethrow) {
              setTimeout(function() {
                if (rethrow) {
                  throw util.fromLeft(step);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING:
            return;
        }
      }
    }
    function onComplete(join) {
      return function() {
        if (status === COMPLETED) {
          rethrow = rethrow && join.rethrow;
          join.handler(step)();
          return function() {};
        }
        var jid = joinId++;
        joins = joins || {};
        joins[jid] = join;
        return function() {
          if (joins !== null) {
            delete joins[jid];
          }
        };
      };
    }
    function kill(error, cb) {
      return function() {
        if (status === COMPLETED) {
          cb(util.right(undefined))();
          return function() {};
        }
        var canceler = onComplete({
          rethrow: false,
          handler: function() {
            return cb(util.right(undefined));
          }
        })();
        switch (status) {
          case SUSPENDED:
            interrupt = util.left(error);
            status = COMPLETED;
            step = interrupt;
            run(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff(CONS, new Aff(FINALIZER, step(error)), attempts, interrupt);
              }
              status = RETURN;
              step = null;
              fail = null;
              run(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step = null;
              fail = null;
            }
        }
        return canceler;
      };
    }
    function join(cb) {
      return function() {
        var canceler = onComplete({
          rethrow: false,
          handler: cb
        })();
        if (status === SUSPENDED) {
          run(runTick);
        }
        return canceler;
      };
    }
    return {
      kill,
      join,
      onComplete,
      isSuspended: function() {
        return status === SUSPENDED;
      },
      run: function() {
        if (status === SUSPENDED) {
          if (!Scheduler.isDraining()) {
            Scheduler.enqueue(function() {
              run(runTick);
            });
          } else {
            run(runTick);
          }
        }
      }
    };
  }
  function runPar(util, supervisor, par, cb) {
    var fiberId = 0;
    var fibers = {};
    var killId = 0;
    var kills = {};
    var early = new Error("[ParAff] Early exit");
    var interrupt = null;
    var root = EMPTY;
    function kill(error, par, cb) {
      var step = par;
      var head = null;
      var tail = null;
      var count = 0;
      var kills = {};
      var tmp, kid;
      loop:
        while (true) {
          tmp = null;
          switch (step.tag) {
            case FORKED:
              if (step._3 === EMPTY) {
                tmp = fibers[step._1];
                kills[count++] = tmp.kill(error, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb(result)();
                    }
                  };
                });
              }
              if (head === null) {
                break loop;
              }
              step = head._2;
              if (tail === null) {
                head = null;
              } else {
                head = tail._1;
                tail = tail._2;
              }
              break;
            case MAP:
              step = step._2;
              break;
            case APPLY:
            case ALT:
              if (head) {
                tail = new Aff(CONS, head, tail);
              }
              head = step;
              step = step._1;
              break;
          }
        }
      if (count === 0) {
        cb(util.right(undefined))();
      } else {
        kid = 0;
        tmp = count;
        for (;kid < tmp; kid++) {
          kills[kid] = kills[kid]();
        }
      }
      return kills;
    }
    function join(result, head, tail) {
      var fail, step, lhs, rhs, tmp, kid;
      if (util.isLeft(result)) {
        fail = result;
        step = null;
      } else {
        step = result;
        fail = null;
      }
      loop:
        while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head === null) {
            cb(fail || step)();
            return;
          }
          if (head._3 !== EMPTY) {
            return;
          }
          switch (head.tag) {
            case MAP:
              if (fail === null) {
                head._3 = util.right(head._1(util.fromRight(step)));
                step = head._3;
              } else {
                head._3 = fail;
              }
              break;
            case APPLY:
              lhs = head._1._3;
              rhs = head._2._3;
              if (fail) {
                head._3 = fail;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, fail === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join(fail, null, null);
                    } else {
                      join(fail, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head._3 = step;
              }
              break;
            case ALT:
              lhs = head._1._3;
              rhs = head._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail = step === lhs ? rhs : lhs;
                step = null;
                head._3 = fail;
              } else {
                head._3 = step;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, step === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join(step, null, null);
                    } else {
                      join(step, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail === null) {
            head = null;
          } else {
            head = tail._1;
            tail = tail._2;
          }
        }
    }
    function resolve(fiber) {
      return function(result) {
        return function() {
          delete fibers[fiber._1];
          fiber._3 = result;
          join(result, fiber._2._1, fiber._2._2);
        };
      };
    }
    function run() {
      var status = CONTINUE;
      var step = par;
      var head = null;
      var tail = null;
      var tmp, fid;
      loop:
        while (true) {
          tmp = null;
          fid = null;
          switch (status) {
            case CONTINUE:
              switch (step.tag) {
                case MAP:
                  if (head) {
                    tail = new Aff(CONS, head, tail);
                  }
                  head = new Aff(MAP, step._1, EMPTY, EMPTY);
                  step = step._2;
                  break;
                case APPLY:
                  if (head) {
                    tail = new Aff(CONS, head, tail);
                  }
                  head = new Aff(APPLY, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                case ALT:
                  if (head) {
                    tail = new Aff(CONS, head, tail);
                  }
                  head = new Aff(ALT, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step;
                  step = new Aff(FORKED, fid, new Aff(CONS, head, tail), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve(step)
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head === null) {
                break loop;
              }
              if (head._1 === EMPTY) {
                head._1 = step;
                status = CONTINUE;
                step = head._2;
                head._2 = EMPTY;
              } else {
                head._2 = step;
                step = head;
                if (tail === null) {
                  head = null;
                } else {
                  head = tail._1;
                  tail = tail._2;
                }
              }
          }
        }
      root = step;
      for (fid = 0;fid < fiberId; fid++) {
        fibers[fid].run();
      }
    }
    function cancel(error, cb) {
      interrupt = util.left(error);
      var innerKills;
      for (var kid in kills) {
        if (kills.hasOwnProperty(kid)) {
          innerKills = kills[kid];
          for (kid in innerKills) {
            if (innerKills.hasOwnProperty(kid)) {
              innerKills[kid]();
            }
          }
        }
      }
      kills = null;
      var newKills = kill(error, root, cb);
      return function(killError) {
        return new Aff(ASYNC, function(killCb) {
          return function() {
            for (var kid in newKills) {
              if (newKills.hasOwnProperty(kid)) {
                newKills[kid]();
              }
            }
            return nonCanceler;
          };
        });
      };
    }
    run();
    return function(killError) {
      return new Aff(ASYNC, function(killCb) {
        return function() {
          return cancel(killError, killCb);
        };
      });
    };
  }
  function sequential(util, supervisor, par) {
    return new Aff(ASYNC, function(cb) {
      return function() {
        return runPar(util, supervisor, par, cb);
      };
    });
  }
  Aff.EMPTY = EMPTY;
  Aff.Pure = AffCtr(PURE);
  Aff.Throw = AffCtr(THROW);
  Aff.Catch = AffCtr(CATCH);
  Aff.Sync = AffCtr(SYNC);
  Aff.Async = AffCtr(ASYNC);
  Aff.Bind = AffCtr(BIND);
  Aff.Bracket = AffCtr(BRACKET);
  Aff.Fork = AffCtr(FORK);
  Aff.Seq = AffCtr(SEQ);
  Aff.ParMap = AffCtr(MAP);
  Aff.ParApply = AffCtr(APPLY);
  Aff.ParAlt = AffCtr(ALT);
  Aff.Fiber = Fiber;
  Aff.Supervisor = Supervisor;
  Aff.Scheduler = Scheduler;
  Aff.nonCanceler = nonCanceler;
  return Aff;
}();
var _pure = Aff.Pure;
var _throwError = Aff.Throw;
function _catchError(aff) {
  return function(k) {
    return Aff.Catch(aff, k);
  };
}
function _map(f) {
  return function(aff) {
    if (aff.tag === Aff.Pure.tag) {
      return Aff.Pure(f(aff._1));
    } else {
      return Aff.Bind(aff, function(value) {
        return Aff.Pure(f(value));
      });
    }
  };
}
function _bind(aff) {
  return function(k) {
    return Aff.Bind(aff, k);
  };
}
var _liftEffect = Aff.Sync;
function _parAffAlt(aff1) {
  return function(aff2) {
    return Aff.ParAlt(aff1, aff2);
  };
}
var makeAff = Aff.Async;
function generalBracket(acquire) {
  return function(options) {
    return function(k) {
      return Aff.Bracket(acquire, options, k);
    };
  };
}
function _makeFiber(util, aff) {
  return function() {
    return Aff.Fiber(util, null, aff);
  };
}
var _delay = function() {
  function setDelay(n, k) {
    if (n === 0 && typeof setImmediate !== "undefined") {
      return setImmediate(k);
    } else {
      return setTimeout(k, n);
    }
  }
  function clearDelay(n, t) {
    if (n === 0 && typeof clearImmediate !== "undefined") {
      return clearImmediate(t);
    } else {
      return clearTimeout(t);
    }
  }
  return function(right, ms) {
    return Aff.Async(function(cb) {
      return function() {
        var timer = setDelay(ms, cb(right()));
        return function() {
          return Aff.Sync(function() {
            return right(clearDelay(ms, timer));
          });
        };
      };
    });
  };
}();
var _sequential = Aff.Seq;
// output-es/Effect.Aff/index.js
var functorAff = { map: _map };
var ffiUtil = {
  isLeft: (v) => {
    if (v.tag === "Left") {
      return true;
    }
    if (v.tag === "Right") {
      return false;
    }
    fail();
  },
  fromLeft: (v) => {
    if (v.tag === "Left") {
      return v._1;
    }
    if (v.tag === "Right") {
      return _crashWith("unsafeFromLeft: Right");
    }
    fail();
  },
  fromRight: (v) => {
    if (v.tag === "Right") {
      return v._1;
    }
    if (v.tag === "Left") {
      return _crashWith("unsafeFromRight: Left");
    }
    fail();
  },
  left: Left,
  right: Right
};
var monadAff = { Applicative0: () => applicativeAff, Bind1: () => bindAff };
var bindAff = { bind: _bind, Apply0: () => applyAff };
var applyAff = { apply: (f) => (a) => _bind(f)((f$p) => _bind(a)((a$p) => applicativeAff.pure(f$p(a$p)))), Functor0: () => functorAff };
var applicativeAff = { pure: _pure, Apply0: () => applyAff };
var $$finally = (fin) => (a) => generalBracket(_pure())({ killed: (v) => (v$1) => fin, failed: (v) => (v$1) => fin, completed: (v) => (v$1) => fin })((v) => a);
var monadThrowAff = { throwError: _throwError, Monad0: () => monadAff };
var monadErrorAff = { catchError: _catchError, MonadThrow0: () => monadThrowAff };
var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
var runAff = (k) => (aff) => {
  const $0 = _makeFiber(ffiUtil, _bind($$try2(aff))((x) => _liftEffect(k(x))));
  return () => {
    const fiber = $0();
    fiber.run();
    return fiber;
  };
};
var nonCanceler = /* @__PURE__ */ (() => {
  const $0 = _pure();
  return (v) => $0;
})();

// output-es/Control.Bind/foreign.js
var arrayBind = typeof Array.prototype.flatMap === "function" ? function(arr) {
  return function(f) {
    return arr.flatMap(f);
  };
} : function(arr) {
  return function(f) {
    var result = [];
    var l = arr.length;
    for (var i = 0;i < l; i++) {
      var xs = f(arr[i]);
      var k = xs.length;
      for (var j = 0;j < k; j++) {
        result.push(xs[j]);
      }
    }
    return result;
  };
};
// output-es/Control.Applicative/index.js
var applicativeArray = { pure: (x) => [x], Apply0: () => applyArray };

// output-es/Data.Identity/index.js
var Identity = (x) => x;
var functorIdentity = { map: (f) => (m) => f(m) };
var applyIdentity = { apply: (v) => (v1) => v(v1), Functor0: () => functorIdentity };
var bindIdentity = { bind: (v) => (f) => f(v), Apply0: () => applyIdentity };
var applicativeIdentity = { pure: Identity, Apply0: () => applyIdentity };
var monadIdentity = { Applicative0: () => applicativeIdentity, Bind1: () => bindIdentity };
// output-es/Data.Array.ST/foreign.js
var sortByImpl = function() {
  function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1)
      mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1)
      mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
    i = from;
    j = mid;
    k = from;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare, fromOrdering, xs) {
    if (xs.length < 2)
      return xs;
    mergeFromTo(compare, fromOrdering, xs, xs.slice(0), 0, xs.length);
    return xs;
  };
}();
// output-es/Data.Tuple/index.js
var $Tuple = (_1, _2) => ({ tag: "Tuple", _1, _2 });
var Tuple = (value0) => (value1) => $Tuple(value0, value1);
var snd = (v) => v._2;
var fst = (v) => v._1;

// output-es/Data.FunctorWithIndex/foreign.js
var mapWithIndexArray = function(f) {
  return function(xs) {
    var l = xs.length;
    var result = Array(l);
    for (var i = 0;i < l; i++) {
      result[i] = f(i)(xs[i]);
    }
    return result;
  };
};
// output-es/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqIntImpl = refEq;
var eqNumberImpl = refEq;
var eqStringImpl = refEq;
// output-es/Data.Eq/index.js
var eqString = { eq: eqStringImpl };
var eqNumber = { eq: eqNumberImpl };
var eqInt = { eq: eqIntImpl };

// output-es/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq) {
    return function(gt) {
      return function(x) {
        return function(y) {
          return x < y ? lt : x === y ? eq : gt;
        };
      };
    };
  };
};
var ordIntImpl = unsafeCompareImpl;
var ordNumberImpl = unsafeCompareImpl;
var ordStringImpl = unsafeCompareImpl;
// output-es/Data.Ord/index.js
var ordString = { compare: /* @__PURE__ */ ordStringImpl(LT)(EQ)(GT), Eq0: () => eqString };
var ordNumber = { compare: /* @__PURE__ */ ordNumberImpl(LT)(EQ)(GT), Eq0: () => eqNumber };
var ordInt = { compare: /* @__PURE__ */ ordIntImpl(LT)(EQ)(GT), Eq0: () => eqInt };

// output-es/Data.Traversable/foreign.js
var traverseArrayImpl = function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat2(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply) {
    return function(map) {
      return function(pure) {
        return function(f) {
          return function(array) {
            function go(bot, top) {
              switch (top - bot) {
                case 0:
                  return pure([]);
                case 1:
                  return map(array1)(f(array[bot]));
                case 2:
                  return apply(map(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply(apply(map(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top - bot) / 4) * 2;
                  return apply(map(concat2)(go(bot, pivot)))(go(pivot, top));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();
// output-es/Data.Traversable/index.js
var traversableMaybe = {
  traverse: (dictApplicative) => (v) => (v1) => {
    if (v1.tag === "Nothing") {
      return dictApplicative.pure(Nothing);
    }
    if (v1.tag === "Just") {
      return dictApplicative.Apply0().Functor0().map(Just)(v(v1._1));
    }
    fail();
  },
  sequence: (dictApplicative) => (v) => {
    if (v.tag === "Nothing") {
      return dictApplicative.pure(Nothing);
    }
    if (v.tag === "Just") {
      return dictApplicative.Apply0().Functor0().map(Just)(v._1);
    }
    fail();
  },
  Functor0: () => functorMaybe,
  Foldable1: () => foldableMaybe
};

// output-es/Data.Array/foreign.js
var rangeImpl = function(start, end) {
  var step = start > end ? -1 : 1;
  var result = new Array(step * (end - start) + 1);
  var i = start, n = 0;
  while (i !== end) {
    result[n++] = i;
    i += step;
  }
  result[n] = i;
  return result;
};
var replicateFill = function(count, value) {
  if (count < 1) {
    return [];
  }
  var result = new Array(count);
  return result.fill(value);
};
var replicatePolyfill = function(count, value) {
  var result = [];
  var n = 0;
  for (var i = 0;i < count; i++) {
    result[n++] = value;
  }
  return result;
};
var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = function() {
  function Cons(head, tail) {
    this.head = head;
    this.tail = tail;
  }
  var emptyList = {};
  function curryCons(head) {
    return function(tail) {
      return new Cons(head, tail);
    };
  }
  function listToArray(list) {
    var result = [];
    var count = 0;
    var xs = list;
    while (xs !== emptyList) {
      result[count++] = xs.head;
      xs = xs.tail;
    }
    return result;
  }
  return function(foldr, xs) {
    return listToArray(foldr(curryCons)(emptyList)(xs));
  };
}();
var findMapImpl = function(nothing, isJust, f, xs) {
  for (var i = 0;i < xs.length; i++) {
    var result = f(xs[i]);
    if (isJust(result))
      return result;
  }
  return nothing;
};
var sortByImpl2 = function() {
  function mergeFromTo(compare, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1)
      mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1)
      mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to);
    i = from;
    j = mid;
    k = from;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare, fromOrdering, xs) {
    var out;
    if (xs.length < 2)
      return xs;
    out = xs.slice(0);
    mergeFromTo(compare, fromOrdering, out, xs.slice(0), 0, xs.length);
    return out;
  };
}();
// output-es/Data.Array/index.js
var findMap = ($0) => ($1) => findMapImpl(Nothing, isJust, $0, $1);
// output-es/Data.EuclideanRing/foreign.js
var intMod = function(x) {
  return function(y) {
    if (y === 0)
      return 0;
    var yy = Math.abs(y);
    return (x % yy + yy) % yy;
  };
};
// output-es/Markgraf.Animation.Render.Theme/index.js
var $BackgroundTransparency = (tag) => tag;
var $Theme = (tag) => tag;
var Light = /* @__PURE__ */ $Theme("Light");
var Dark = /* @__PURE__ */ $Theme("Dark");
var PaintBackground = /* @__PURE__ */ $BackgroundTransparency("PaintBackground");
var TransparentBackground = /* @__PURE__ */ $BackgroundTransparency("TransparentBackground");

// output-es/Markgraf.Omp.Host/foreign.js
import {
  KITTY_PLACEHOLDER,
  ImageProtocol,
  TERMINAL,
  getCellDimensions,
  getKittyGraphics,
  encodeKittyVirtualPlacement,
  renderKittyPlaceholderLines,
  matchesKey as nativeMatchesKey,
  replaceTabs,
  truncateToWidth
} from "@oh-my-pi/pi-tui";
import { sanitizeText } from "@oh-my-pi/pi-utils";
var register = (api) => (callbacks) => () => {
  api.setLabel("Markgraf");
  api.registerCommand("markgraf", {
    description: "Play a Markgraf animation; --background opts into theme paper",
    handler: async (path, ctx) => {
      try {
        await callbacks.command({ ctx, signal: undefined })(path)();
      } catch (error) {
        ctx.ui.notify(error instanceof Error ? error.message : String(error), "error");
      }
    }
  });
  api.registerTool({
    name: "markgraf_play",
    label: "Markgraf",
    description: "Play a Markgraf animation inline, transparent unless background is true",
    parameters: api.zod.object({ path: api.zod.string(), background: api.zod.boolean().optional() }),
    execute: async (_toolCallId, args, signal, _onUpdate, ctx) => ({
      content: [{ type: "text", text: await callbacks.tool({ ctx, signal })(args)() }]
    })
  });
};
var cwd = (context) => () => context.ctx.cwd;
var interactive = (context) => () => context.ctx.mode === "tui";
var mount = (context) => (createComponent) => () => context.ctx.ui.custom((tui, theme, _keybindings, done) => {
  const component = createComponent({ tui, theme, done: (value) => () => done(value) })();
  return {
    render: (width) => component.render(width)(),
    handleInput: (data) => component.handleInput(data)(),
    invalidate: () => component.invalidate(),
    dispose: () => component.dispose()
  };
}, { signal: context.signal });
var size = (tui) => () => {
  const { widthPx, heightPx } = getCellDimensions();
  return {
    columns: tui.terminal.columns,
    rows: tui.terminal.rows,
    cellWidth: widthPx,
    cellHeight: heightPx
  };
};
var supportsImages = () => TERMINAL.imageProtocol === ImageProtocol.Kitty && getKittyGraphics().unicodePlaceholders;
var createImage = (tui) => () => {
  const key = crypto.randomUUID();
  const id = tui.imageBudget.acquireId(key);
  return { key, id, marker: `\x1B[38;2;${id >> 16 & 255};${id >> 8 & 255};${id & 255}m` };
};
var placeholderRows = (image) => (columns) => (rows) => renderKittyPlaceholderLines({ imageId: image.id, placementId: 1, columns, rows });
var observeImage = (tui) => (image) => () => {
  if (tui.imageBudget.observe(image.id))
    return false;
  tui.imageBudget.enqueueTransmit(image.id, "");
  return true;
};
var transmit = (tui) => (image) => (columns) => (rows) => (frame) => () => {
  const name = Buffer.from(frame.name, "utf8").toString("base64");
  tui.terminal.write(`\x1B_Ga=t,f=32,t=s,q=0,i=${image.id},s=${frame.width},v=${frame.height},S=${frame.byteLength};${name}\x1B\\` + encodeKittyVirtualPlacement({ imageId: image.id, placementId: 1, columns, rows }));
};
var onAcknowledgement = (tui) => (image) => (callback) => () => tui.addInputListener((data) => {
  const reply = /^\x1b_G([^;]*);([\s\S]*)\x1b\\$/.exec(data);
  if (!reply)
    return;
  const id = /(?:^|,)i=(\d+)(?:,|$)/.exec(reply[1]);
  if (!id || Number(id[1]) !== image.id)
    return;
  callback(reply[2])();
  return { consume: true };
});
var onPaint = (tui) => (image) => (callback) => () => tui.addPaintListener((paint) => callback({
  visible: paint.viewport.some((line) => line.includes(KITTY_PLACEHOLDER) && line.includes(image.marker)),
  alt: paint.alt,
  reset: paint.reset
})());
var releaseImage = (tui) => (image) => () => tui.imageBudget.release(image.key);
var requestRender = (tui) => () => tui.requestRender();
var formatLine = (theme) => (width) => (line) => truncateToWidth(theme.fg("muted", replaceTabs(sanitizeText(line).replaceAll(`
`, " "))), width);
var matchesKey = (data) => (key) => nativeMatchesKey(data, key);
var isLight = (theme) => theme.isLight;
// output-es/Data.Number/foreign.js
var isFiniteImpl = isFinite;
var ceil = Math.ceil;
var floor = Math.floor;
var round = Math.round;
// output-es/Data.Int/foreign.js
var fromNumberImpl = function(just) {
  return function(nothing) {
    return function(n) {
      return (n | 0) === n ? just(n) : nothing;
    };
  };
};
var toNumber = function(n) {
  return n;
};
var fromStringAsImpl = function(just) {
  return function(nothing) {
    return function(radix) {
      var digits;
      if (radix < 11) {
        digits = "[0-" + (radix - 1).toString() + "]";
      } else if (radix === 11) {
        digits = "[0-9a]";
      } else {
        digits = "[0-9a-" + String.fromCharCode(86 + radix) + "]";
      }
      var pattern = new RegExp("^[\\+\\-]?" + digits + "+$", "i");
      return function(s) {
        if (pattern.test(s)) {
          var i = parseInt(s, radix);
          return (i | 0) === i ? just(i) : nothing;
        } else {
          return nothing;
        }
      };
    };
  };
};
// output-es/Data.Int/index.js
var fromStringAs = /* @__PURE__ */ fromStringAsImpl(Just)(Nothing);
var fromString = /* @__PURE__ */ fromStringAs(10);
var fromNumber = /* @__PURE__ */ fromNumberImpl(Just)(Nothing);
var unsafeClamp = (x) => {
  if (!isFiniteImpl(x)) {
    return 0;
  }
  if (x >= toNumber(2147483647)) {
    return 2147483647;
  }
  if (x <= toNumber(-2147483648)) {
    return -2147483648;
  }
  const $0 = fromNumber(x);
  if ($0.tag === "Nothing") {
    return 0;
  }
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};

// output-es/Data.Number.Format/foreign.js
function wrap(method) {
  return function(d) {
    return function(num) {
      return method.apply(num, [d]);
    };
  };
}
var toPrecisionNative = wrap(Number.prototype.toPrecision);
var toFixedNative = wrap(Number.prototype.toFixed);
var toExponentialNative = wrap(Number.prototype.toExponential);

// output-es/Data.Number.Format/index.js
var $Format = (tag, _1) => ({ tag, _1 });
var clamp = (low) => (hi) => (x) => {
  const v = ordInt.compare(low)(x);
  const $0 = (() => {
    if (v === "LT") {
      return x;
    }
    if (v === "EQ") {
      return low;
    }
    if (v === "GT") {
      return low;
    }
    fail();
  })();
  const v$1 = ordInt.compare(hi)($0);
  if (v$1 === "LT") {
    return hi;
  }
  if (v$1 === "EQ") {
    return hi;
  }
  if (v$1 === "GT") {
    return $0;
  }
  fail();
};
var toStringWith = (v) => {
  if (v.tag === "Precision") {
    return toPrecisionNative(v._1);
  }
  if (v.tag === "Fixed") {
    return toFixedNative(v._1);
  }
  if (v.tag === "Exponential") {
    return toExponentialNative(v._1);
  }
  fail();
};

// output-es/Data.String.Unsafe/foreign.js
var charAt = function(i) {
  return function(s) {
    if (i >= 0 && i < s.length)
      return s.charAt(i);
    throw new Error("Data.String.Unsafe.charAt: Invalid index.");
  };
};
// output-es/Data.String.CodeUnits/foreign.js
var fromCharArray = function(a) {
  return a.join("");
};
var toCharArray = function(s) {
  return s.split("");
};
var singleton = function(c) {
  return c;
};
var length2 = function(s) {
  return s.length;
};
var _indexOf = function(just) {
  return function(nothing) {
    return function(x) {
      return function(s) {
        var i = s.indexOf(x);
        return i === -1 ? nothing : just(i);
      };
    };
  };
};
var take = function(n) {
  return function(s) {
    return s.substr(0, n);
  };
};
var drop = function(n) {
  return function(s) {
    return s.substring(n);
  };
};
var splitAt = function(i) {
  return function(s) {
    return { before: s.substring(0, i), after: s.substring(i) };
  };
};
// output-es/Data.String.CodeUnits/index.js
var stripSuffix = (v) => (str) => {
  const v1 = splitAt(length2(str) - length2(v) | 0)(str);
  if (v1.after === v) {
    return $Maybe("Just", v1.before);
  }
  return Nothing;
};
var stripPrefix = (v) => (str) => {
  const v1 = splitAt(length2(v))(str);
  if (v1.before === v) {
    return $Maybe("Just", v1.after);
  }
  return Nothing;
};
var indexOf = /* @__PURE__ */ _indexOf(Just)(Nothing);
var contains = (pat) => {
  const $0 = indexOf(pat);
  return (x) => {
    const $1 = $0(x);
    if ($1.tag === "Nothing") {
      return false;
    }
    if ($1.tag === "Just") {
      return true;
    }
    fail();
  };
};

// output-es/Data.String.Common/foreign.js
var split = function(sep) {
  return function(s) {
    return s.split(sep);
  };
};
var trim = function(s) {
  return s.trim();
};
// output-es/Effect.Timer/foreign.js
function setTimeoutImpl(ms) {
  return function(fn) {
    return function() {
      return setTimeout(fn, ms);
    };
  };
}
function clearTimeoutImpl(id) {
  return function() {
    clearTimeout(id);
  };
}
function setIntervalImpl(ms) {
  return function(fn) {
    return function() {
      return setInterval(fn, ms);
    };
  };
}
function clearIntervalImpl(id) {
  return function() {
    clearInterval(id);
  };
}
// output-es/Data.NonEmpty/index.js
var $NonEmpty = (_1, _2) => ({ tag: "NonEmpty", _1, _2 });

// output-es/Data.List.Types/index.js
var $List = (tag, _1, _2) => ({ tag, _1, _2 });
var Nil = /* @__PURE__ */ $List("Nil");
var Cons = (value0) => (value1) => $List("Cons", value0, value1);
var listMap = (f) => {
  const chunkedRevMap = (chunkedRevMap$a0$copy) => (chunkedRevMap$a1$copy) => {
    let chunkedRevMap$a0 = chunkedRevMap$a0$copy, chunkedRevMap$a1 = chunkedRevMap$a1$copy, chunkedRevMap$c = true, chunkedRevMap$r;
    while (chunkedRevMap$c) {
      const v = chunkedRevMap$a0, v1 = chunkedRevMap$a1;
      if (v1.tag === "Cons" && v1._2.tag === "Cons" && v1._2._2.tag === "Cons") {
        chunkedRevMap$a0 = $List("Cons", v1, v);
        chunkedRevMap$a1 = v1._2._2._2;
        continue;
      }
      const reverseUnrolledMap = (reverseUnrolledMap$a0$copy) => (reverseUnrolledMap$a1$copy) => {
        let reverseUnrolledMap$a0 = reverseUnrolledMap$a0$copy, reverseUnrolledMap$a1 = reverseUnrolledMap$a1$copy, reverseUnrolledMap$c = true, reverseUnrolledMap$r;
        while (reverseUnrolledMap$c) {
          const v2 = reverseUnrolledMap$a0, v3 = reverseUnrolledMap$a1;
          if (v2.tag === "Cons" && v2._1.tag === "Cons" && v2._1._2.tag === "Cons" && v2._1._2._2.tag === "Cons") {
            reverseUnrolledMap$a0 = v2._2;
            reverseUnrolledMap$a1 = $List("Cons", f(v2._1._1), $List("Cons", f(v2._1._2._1), $List("Cons", f(v2._1._2._2._1), v3)));
            continue;
          }
          reverseUnrolledMap$c = false;
          reverseUnrolledMap$r = v3;
        }
        return reverseUnrolledMap$r;
      };
      chunkedRevMap$c = false;
      chunkedRevMap$r = reverseUnrolledMap(v)((() => {
        if (v1.tag === "Cons") {
          if (v1._2.tag === "Cons") {
            if (v1._2._2.tag === "Nil") {
              return $List("Cons", f(v1._1), $List("Cons", f(v1._2._1), Nil));
            }
            return Nil;
          }
          if (v1._2.tag === "Nil") {
            return $List("Cons", f(v1._1), Nil);
          }
        }
        return Nil;
      })());
    }
    return chunkedRevMap$r;
  };
  return chunkedRevMap(Nil);
};
var functorNonEmptyList = { map: (f) => (m) => $NonEmpty(f(m._1), listMap(f)(m._2)) };
var foldableList = {
  foldr: (f) => (b) => {
    const $0 = foldableList.foldl((b$1) => (a) => f(a)(b$1))(b);
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0, v1 = go$a1;
        if (v1.tag === "Nil") {
          go$c = false;
          go$r = v;
          continue;
        }
        if (v1.tag === "Cons") {
          go$a0 = $List("Cons", v1._1, v);
          go$a1 = v1._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    const $1 = go(Nil);
    return (x) => $0($1(x));
  },
  foldl: (f) => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const b = go$a0, v = go$a1;
        if (v.tag === "Nil") {
          go$c = false;
          go$r = b;
          continue;
        }
        if (v.tag === "Cons") {
          go$a0 = f(b)(v._1);
          go$a1 = v._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go;
  },
  foldMap: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (f) => foldableList.foldl((acc) => {
      const $0 = dictMonoid.Semigroup0().append(acc);
      return (x) => $0(f(x));
    })(mempty);
  }
};
var semigroupNonEmptyList = { append: (v) => (as$p) => $NonEmpty(v._1, foldableList.foldr(Cons)($List("Cons", as$p._1, as$p._2))(v._2)) };
var showList = (dictShow) => {
  const show = dictShow.show;
  return {
    show: (v) => {
      if (v.tag === "Nil") {
        return "Nil";
      }
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v$1 = go$a1;
          if (v$1.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v$1.tag === "Cons") {
            go$a0 = b.init ? { init: false, acc: v$1._1 } : { init: false, acc: b.acc + " : " + v$1._1 };
            go$a1 = v$1._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return "(" + go({ init: true, acc: "" })(listMap(show)(v)).acc + " : Nil)";
    }
  };
};
var showNonEmptyList = (dictShow) => {
  const $0 = showList(dictShow);
  return { show: (v) => "(NonEmptyList (NonEmpty " + dictShow.show(v._1) + " " + $0.show(v._2) + "))" };
};

// output-es/Data.Semigroup/foreign.js
var concatString = function(s1) {
  return function(s2) {
    return s1 + s2;
  };
};
var concatArray = function(xs) {
  return function(ys) {
    if (xs.length === 0)
      return ys;
    if (ys.length === 0)
      return xs;
    return xs.concat(ys);
  };
};
// output-es/Data.Semigroup/index.js
var semigroupString = { append: concatString };
var semigroupArray = { append: concatArray };

// output-es/Data.Monoid/index.js
var monoidString = { mempty: "", Semigroup0: () => semigroupString };
var monoidArray = { mempty: [], Semigroup0: () => semigroupArray };

// output-es/Data.Unfoldable1/foreign.js
var unfoldr1ArrayImpl = function(isNothing) {
  return function(fromJust) {
    return function(fst) {
      return function(snd) {
        return function(f) {
          return function(b) {
            var result = [];
            var value = b;
            while (true) {
              var tuple = f(value);
              result.push(fst(tuple));
              var maybe = snd(tuple);
              if (isNothing(maybe))
                return result;
              value = fromJust(maybe);
            }
          };
        };
      };
    };
  };
};

// output-es/Data.Unfoldable1/index.js
var fromJust = (v) => {
  if (v.tag === "Just") {
    return v._1;
  }
  fail();
};
var unfoldable1Array = { unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust)(fst)(snd) };

// output-es/Data.Unfoldable/foreign.js
var unfoldrArrayImpl = function(isNothing) {
  return function(fromJust) {
    return function(fst) {
      return function(snd) {
        return function(f) {
          return function(b) {
            var result = [];
            var value = b;
            while (true) {
              var maybe = f(value);
              if (isNothing(maybe))
                return result;
              var tuple = fromJust(maybe);
              result.push(fst(tuple));
              value = snd(tuple);
            }
          };
        };
      };
    };
  };
};

// output-es/Data.Unfoldable/index.js
var fromJust2 = (v) => {
  if (v.tag === "Just") {
    return v._1;
  }
  fail();
};
var unfoldableArray = {
  unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust2)(fst)(snd),
  Unfoldable10: () => unfoldable1Array
};

// output-es/Data.Map.Internal/index.js
var $$$Map = (tag, _1, _2, _3, _4, _5, _6) => ({ tag, _1, _2, _3, _4, _5, _6 });
var $SplitLast = (_1, _2, _3) => ({ tag: "SplitLast", _1, _2, _3 });
var Leaf = /* @__PURE__ */ $$$Map("Leaf");
var unsafeNode = (k, v, l, r) => {
  if (l.tag === "Leaf") {
    if (r.tag === "Leaf") {
      return $$$Map("Node", 1, 1, k, v, l, r);
    }
    if (r.tag === "Node") {
      return $$$Map("Node", 1 + r._1 | 0, 1 + r._2 | 0, k, v, l, r);
    }
    fail();
  }
  if (l.tag === "Node") {
    if (r.tag === "Leaf") {
      return $$$Map("Node", 1 + l._1 | 0, 1 + l._2 | 0, k, v, l, r);
    }
    if (r.tag === "Node") {
      return $$$Map("Node", l._1 > r._1 ? 1 + l._1 | 0 : 1 + r._1 | 0, (1 + l._2 | 0) + r._2 | 0, k, v, l, r);
    }
  }
  fail();
};
var unsafeBalancedNode = (k, v, l, r) => {
  if (l.tag === "Leaf") {
    if (r.tag === "Leaf") {
      return $$$Map("Node", 1, 1, k, v, Leaf, Leaf);
    }
    if (r.tag === "Node" && r._1 > 1) {
      if (r._5.tag === "Node" && (() => {
        if (r._6.tag === "Leaf") {
          return r._5._1 > 0;
        }
        if (r._6.tag === "Node") {
          return r._5._1 > r._6._1;
        }
        fail();
      })()) {
        return unsafeNode(r._5._3, r._5._4, unsafeNode(k, v, l, r._5._5), unsafeNode(r._3, r._4, r._5._6, r._6));
      }
      return unsafeNode(r._3, r._4, unsafeNode(k, v, l, r._5), r._6);
    }
    return unsafeNode(k, v, l, r);
  }
  if (l.tag === "Node") {
    if (r.tag === "Node") {
      if (r._1 > (l._1 + 1 | 0)) {
        if (r._5.tag === "Node" && (() => {
          if (r._6.tag === "Leaf") {
            return r._5._1 > 0;
          }
          if (r._6.tag === "Node") {
            return r._5._1 > r._6._1;
          }
          fail();
        })()) {
          return unsafeNode(r._5._3, r._5._4, unsafeNode(k, v, l, r._5._5), unsafeNode(r._3, r._4, r._5._6, r._6));
        }
        return unsafeNode(r._3, r._4, unsafeNode(k, v, l, r._5), r._6);
      }
      if (l._1 > (r._1 + 1 | 0)) {
        if (l._6.tag === "Node" && (() => {
          if (l._5.tag === "Leaf") {
            return 0 <= l._6._1;
          }
          if (l._5.tag === "Node") {
            return l._5._1 <= l._6._1;
          }
          fail();
        })()) {
          return unsafeNode(l._6._3, l._6._4, unsafeNode(l._3, l._4, l._5, l._6._5), unsafeNode(k, v, l._6._6, r));
        }
        return unsafeNode(l._3, l._4, l._5, unsafeNode(k, v, l._6, r));
      }
      return unsafeNode(k, v, l, r);
    }
    if (r.tag === "Leaf" && l._1 > 1) {
      if (l._6.tag === "Node" && (() => {
        if (l._5.tag === "Leaf") {
          return 0 <= l._6._1;
        }
        if (l._5.tag === "Node") {
          return l._5._1 <= l._6._1;
        }
        fail();
      })()) {
        return unsafeNode(l._6._3, l._6._4, unsafeNode(l._3, l._4, l._5, l._6._5), unsafeNode(k, v, l._6._6, r));
      }
      return unsafeNode(l._3, l._4, l._5, unsafeNode(k, v, l._6, r));
    }
    return unsafeNode(k, v, l, r);
  }
  fail();
};
var unsafeSplitLast = (k, v, l, r) => {
  if (r.tag === "Leaf") {
    return $SplitLast(k, v, l);
  }
  if (r.tag === "Node") {
    const v1 = unsafeSplitLast(r._3, r._4, r._5, r._6);
    return $SplitLast(v1._1, v1._2, unsafeBalancedNode(k, v, l, v1._3));
  }
  fail();
};
var unsafeJoinNodes = (v, v1) => {
  if (v.tag === "Leaf") {
    return v1;
  }
  if (v.tag === "Node") {
    const v2 = unsafeSplitLast(v._3, v._4, v._5, v._6);
    return unsafeBalancedNode(v2._1, v2._2, v2._3, v1);
  }
  fail();
};
var insert = (dictOrd) => (k) => (v) => {
  const go = (v1) => {
    if (v1.tag === "Leaf") {
      return $$$Map("Node", 1, 1, k, v, Leaf, Leaf);
    }
    if (v1.tag === "Node") {
      const v2 = dictOrd.compare(k)(v1._3);
      if (v2 === "LT") {
        return unsafeBalancedNode(v1._3, v1._4, go(v1._5), v1._6);
      }
      if (v2 === "GT") {
        return unsafeBalancedNode(v1._3, v1._4, v1._5, go(v1._6));
      }
      if (v2 === "EQ") {
        return $$$Map("Node", v1._1, v1._2, k, v, v1._5, v1._6);
      }
    }
    fail();
  };
  return go;
};
var foldableMap = {
  foldr: (f) => (z) => {
    const go = (m$p, z$p) => {
      if (m$p.tag === "Leaf") {
        return z$p;
      }
      if (m$p.tag === "Node") {
        return go(m$p._5, f(m$p._4)(go(m$p._6, z$p)));
      }
      fail();
    };
    return (m) => go(m, z);
  },
  foldl: (f) => (z) => {
    const go = (z$p, m$p) => {
      if (m$p.tag === "Leaf") {
        return z$p;
      }
      if (m$p.tag === "Node") {
        return go(f(go(z$p, m$p._5))(m$p._4), m$p._6);
      }
      fail();
    };
    return (m) => go(z, m);
  },
  foldMap: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    const $0 = dictMonoid.Semigroup0();
    return (f) => {
      const go = (v) => {
        if (v.tag === "Leaf") {
          return mempty;
        }
        if (v.tag === "Node") {
          return $0.append(go(v._5))($0.append(f(v._4))(go(v._6)));
        }
        fail();
      };
      return go;
    };
  }
};
var $$delete = (dictOrd) => (k) => {
  const go = (v) => {
    if (v.tag === "Leaf") {
      return Leaf;
    }
    if (v.tag === "Node") {
      const v1 = dictOrd.compare(k)(v._3);
      if (v1 === "LT") {
        return unsafeBalancedNode(v._3, v._4, go(v._5), v._6);
      }
      if (v1 === "GT") {
        return unsafeBalancedNode(v._3, v._4, v._5, go(v._6));
      }
      if (v1 === "EQ") {
        return unsafeJoinNodes(v._5, v._6);
      }
    }
    fail();
  };
  return go;
};

// output-es/Control.Monad.Except.Trans/index.js
var bindExceptT = (dictMonad) => ({
  bind: (v) => (k) => dictMonad.Bind1().bind(v)((v2) => {
    if (v2.tag === "Left") {
      return dictMonad.Applicative0().pure($Either("Left", v2._1));
    }
    if (v2.tag === "Right") {
      return k(v2._1);
    }
    fail();
  }),
  Apply0: () => applyExceptT(dictMonad)
});
var applyExceptT = (dictMonad) => {
  const $0 = dictMonad.Bind1().Apply0().Functor0();
  const functorExceptT1 = {
    map: (f) => $0.map((m) => {
      if (m.tag === "Left") {
        return $Either("Left", m._1);
      }
      if (m.tag === "Right") {
        return $Either("Right", f(m._1));
      }
      fail();
    })
  };
  return {
    apply: (() => {
      const $1 = bindExceptT(dictMonad);
      return (f) => (a) => $1.bind(f)((f$p) => $1.bind(a)((a$p) => applicativeExceptT(dictMonad).pure(f$p(a$p))));
    })(),
    Functor0: () => functorExceptT1
  };
};
var applicativeExceptT = (dictMonad) => ({ pure: (x) => dictMonad.Applicative0().pure($Either("Right", x)), Apply0: () => applyExceptT(dictMonad) });
var monadThrowExceptT = (dictMonad) => {
  const monadExceptT1 = { Applicative0: () => applicativeExceptT(dictMonad), Bind1: () => bindExceptT(dictMonad) };
  return { throwError: (x) => dictMonad.Applicative0().pure($Either("Left", x)), Monad0: () => monadExceptT1 };
};

// output-es/Foreign/foreign.js
function typeOf(value) {
  return typeof value;
}
function tagOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
function isNull(value) {
  return value === null;
}
var isArray = Array.isArray || function(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
};

// output-es/Foreign/index.js
var $ForeignError = (tag, _1, _2) => ({ tag, _1, _2 });
var ErrorAtIndex = (value0) => (value1) => $ForeignError("ErrorAtIndex", value0, value1);
var ErrorAtProperty = (value0) => (value1) => $ForeignError("ErrorAtProperty", value0, value1);
var showForeignError = {
  show: (v) => {
    if (v.tag === "ForeignError") {
      return "(ForeignError " + showStringImpl(v._1) + ")";
    }
    if (v.tag === "ErrorAtIndex") {
      return "(ErrorAtIndex " + showIntImpl(v._1) + " " + showForeignError.show(v._2) + ")";
    }
    if (v.tag === "ErrorAtProperty") {
      return "(ErrorAtProperty " + showStringImpl(v._1) + " " + showForeignError.show(v._2) + ")";
    }
    if (v.tag === "TypeMismatch") {
      return "(TypeMismatch " + showStringImpl(v._1) + " " + showStringImpl(v._2) + ")";
    }
    fail();
  }
};
var readNull = (dictMonad) => {
  const $0 = applicativeExceptT(dictMonad);
  return (value) => {
    if (isNull(value)) {
      return $0.pure(Nothing);
    }
    return $0.pure($Maybe("Just", value));
  };
};
var readArray = (dictMonad) => (value) => {
  if (isArray(value)) {
    return applicativeExceptT(dictMonad).pure(value);
  }
  return monadThrowExceptT(dictMonad).throwError($NonEmpty($ForeignError("TypeMismatch", "array", tagOf(value)), Nil));
};
var unsafeReadTagged = (dictMonad) => (tag) => (value) => {
  if (tagOf(value) === tag) {
    return applicativeExceptT(dictMonad).pure(value);
  }
  return monadThrowExceptT(dictMonad).throwError($NonEmpty($ForeignError("TypeMismatch", tag, tagOf(value)), Nil));
};
var readBoolean = (dictMonad) => unsafeReadTagged(dictMonad)("Boolean");
var readNumber = (dictMonad) => unsafeReadTagged(dictMonad)("Number");
var readInt = (dictMonad) => (value) => {
  const error = $Either("Left", $NonEmpty($ForeignError("TypeMismatch", "Int", tagOf(value)), Nil));
  return dictMonad.Bind1().Apply0().Functor0().map((v2) => {
    if (v2.tag === "Left") {
      return error;
    }
    if (v2.tag === "Right") {
      const $0 = fromNumber(v2._1);
      if ($0.tag === "Nothing") {
        return error;
      }
      if ($0.tag === "Just") {
        return $Either("Right", $0._1);
      }
    }
    fail();
  })(unsafeReadTagged(dictMonad)("Number")(value));
};
var readString = (dictMonad) => unsafeReadTagged(dictMonad)("String");

// output-es/Data.Bounded/foreign.js
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;
// output-es/Data.Enum/foreign.js
function toCharCode(c) {
  return c.charCodeAt(0);
}
function fromCharCode(c) {
  return String.fromCharCode(c);
}
// output-es/Data.FoldableWithIndex/index.js
var traverseWithIndex_ = (dictApplicative) => {
  const $0 = dictApplicative.Apply0();
  return (dictFoldableWithIndex) => (f) => dictFoldableWithIndex.foldrWithIndex((i) => {
    const $1 = f(i);
    return (x) => {
      const $2 = $1(x);
      return (b) => $0.apply($0.Functor0().map((v) => identity)($2))(b);
    };
  })(dictApplicative.pure());
};
var foldableWithIndexArray = {
  foldrWithIndex: (f) => (z) => {
    const $0 = foldrArray((v) => {
      const $0 = v._1;
      const $1 = v._2;
      return (y) => f($0)($1)(y);
    })(z);
    const $1 = mapWithIndexArray(Tuple);
    return (x) => $0($1(x));
  },
  foldlWithIndex: (f) => (z) => {
    const $0 = foldlArray((y) => (v) => f(v._1)(y)(v._2))(z);
    const $1 = mapWithIndexArray(Tuple);
    return (x) => $0($1(x));
  },
  foldMapWithIndex: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (f) => foldableWithIndexArray.foldrWithIndex((i) => (x) => (acc) => dictMonoid.Semigroup0().append(f(i)(x))(acc))(mempty);
  },
  Foldable0: () => foldableArray
};
// output-es/Effect.Uncurried/foreign.js
var runEffectFn1 = function runEffectFn1(fn) {
  return function(a) {
    return function() {
      return fn(a);
    };
  };
};
// output-es/Foreign.Index/foreign.js
function unsafeReadPropImpl(f, s, key, value) {
  return value == null ? f : s(value[key]);
}

// output-es/Foreign.Index/index.js
var unsafeReadProp = (dictMonad) => {
  const pure = applicativeExceptT(dictMonad).pure;
  return (k) => (value) => unsafeReadPropImpl(monadThrowExceptT(dictMonad).throwError($NonEmpty($ForeignError("TypeMismatch", "object", typeOf(value)), Nil)), pure, k, value);
};

// output-es/Foreign.Object/foreign.js
function _lookup(no, yes, k, m) {
  return k in m ? yes(m[k]) : no;
}
function toArrayWithKey(f) {
  return function(m) {
    var r = [];
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r.push(f(k)(m[k]));
      }
    }
    return r;
  };
}
var keys = Object.keys || toArrayWithKey(function(k) {
  return function() {
    return k;
  };
});
// output-es/Foreign.Object/index.js
var fromFoldable = (dictFoldable) => {
  const $0 = dictFoldable.foldr;
  return (l) => {
    const s = {};
    for (const v of fromFoldableImpl($0, l)) {
      s[v._1] = v._2;
    }
    return s;
  };
};
// output-es/Record.Builder/foreign.js
function unsafeInsert(l) {
  return function(a) {
    return function(rec) {
      rec[l] = a;
      return rec;
    };
  };
}
// output-es/Record.Builder/index.js
var insert2 = () => () => (dictIsSymbol) => (l) => (a) => (r1) => unsafeInsert(dictIsSymbol.reflectSymbol(l))(a)(r1);

// output-es/Yoga.JSON/foreign.js
function reviver(key, value) {
  if (key === "big") {
    return BigInt(value);
  }
  return value;
}
var _parseJSON = (payload) => JSON.parse(payload, reviver);
function replacer(key, value) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}
var _unsafeStringify = (data) => JSON.stringify(data, replacer);

// output-es/Yoga.JSON/index.js
var identity5 = (x) => x;
var bindExceptT2 = /* @__PURE__ */ bindExceptT(monadIdentity);
var applicativeExceptT2 = /* @__PURE__ */ applicativeExceptT(monadIdentity);
var readNull2 = /* @__PURE__ */ readNull(monadIdentity);
var readProp = /* @__PURE__ */ unsafeReadProp(monadIdentity);
var writeForeignString = { writeImpl: unsafeCoerce };
var writeForeignNumber = { writeImpl: unsafeCoerce };
var writeForeignInt = { writeImpl: unsafeCoerce };
var writeForeignForeign = { writeImpl: (x) => x };
var writeForeignFieldsNilRowR = { writeImplFields: (v) => (v1) => identity5 };
var writeForeignBoolean = { writeImpl: unsafeCoerce };
var readForeignString = { readImpl: /* @__PURE__ */ readString(monadIdentity) };
var readForeignNumber = { readImpl: /* @__PURE__ */ readNumber(monadIdentity) };
var readForeignInt = { readImpl: /* @__PURE__ */ readInt(monadIdentity) };
var readForeignFieldsNilRowRo = { getFields: (v) => (v1) => applicativeExceptT2.pure(identity5) };
var readForeignBoolean = { readImpl: /* @__PURE__ */ readBoolean(monadIdentity) };
var writeJSON = (dictWriteForeign) => (x) => _unsafeStringify(dictWriteForeign.writeImpl(x));
var writeForeignFieldsCons = (dictIsSymbol) => (dictWriteForeign) => (dictWriteForeignFields) => () => () => () => ({
  writeImplFields: (v) => (rec) => {
    const $0 = insert2()()(dictIsSymbol)($$Proxy)(dictWriteForeign.writeImpl(unsafeGet(dictIsSymbol.reflectSymbol($$Proxy))(rec)));
    const $1 = dictWriteForeignFields.writeImplFields($$Proxy)(rec);
    return (x) => $0($1(x));
  }
});
var writeForeignNullable = (dictWriteForeign) => ({
  writeImpl: (x) => {
    const $0 = nullable(x, Nothing, Just);
    if ($0.tag === "Nothing") {
      return nullImpl;
    }
    if ($0.tag === "Just") {
      return dictWriteForeign.writeImpl($0._1);
    }
    fail();
  }
});
var sequenceCombining = (dictMonoid) => {
  const mempty = dictMonoid.mempty;
  return (dictFoldable) => (dictApplicative) => dictFoldable.foldl((acc) => (elem) => {
    if (acc.tag === "Left") {
      if (elem.tag === "Left") {
        return $Either("Left", semigroupNonEmptyList.append(acc._1)(elem._1));
      }
      if (elem.tag === "Right") {
        return $Either("Left", acc._1);
      }
      fail();
    }
    if (acc.tag === "Right") {
      if (elem.tag === "Right") {
        return $Either("Right", dictMonoid.Semigroup0().append(acc._1)(dictApplicative.pure(elem._1)));
      }
      if (elem.tag === "Left") {
        return $Either("Left", elem._1);
      }
    }
    fail();
  })($Either("Right", mempty));
};
var sequenceCombining1 = /* @__PURE__ */ sequenceCombining(monoidArray)(foldableArray)(applicativeArray);
var readForeignNullable = (dictReadForeign) => {
  const readImpl5 = dictReadForeign.readImpl;
  return {
    readImpl: (o) => {
      const $0 = functorNonEmptyList.map((error) => {
        if (error.tag === "TypeMismatch") {
          return $ForeignError("TypeMismatch", "Nullable " + error._1, error._2);
        }
        return error;
      });
      const $1 = bindExceptT2.bind(readNull2(o))((x) => {
        const $1 = traversableMaybe.traverse(applicativeExceptT2)(readImpl5)(x);
        if ($1.tag === "Left") {
          return $Either("Left", $1._1);
        }
        if ($1.tag === "Right") {
          return $Either("Right", (() => {
            if ($1._1.tag === "Nothing") {
              return nullImpl;
            }
            if ($1._1.tag === "Just") {
              return notNull($1._1._1);
            }
            fail();
          })());
        }
        fail();
      });
      if ($1.tag === "Right") {
        return $Either("Right", $1._1);
      }
      if ($1.tag === "Left") {
        return $Either("Left", $0($1._1));
      }
      fail();
    }
  };
};
var readAtIdx = (dictReadForeign) => (i) => (f) => {
  const $0 = functorNonEmptyList.map(ErrorAtIndex(i));
  const $1 = dictReadForeign.readImpl(f);
  if ($1.tag === "Right") {
    return $Either("Right", $1._1);
  }
  if ($1.tag === "Left") {
    return $Either("Left", $0($1._1));
  }
  fail();
};
var readForeignArray = (dictReadForeign) => ({
  readImpl: (() => {
    const $0 = mapWithIndexArray(readAtIdx(dictReadForeign));
    return (a) => bindExceptT2.bind(readArray(monadIdentity)(a))((x) => sequenceCombining1($0(x)));
  })()
});
var parseJSON = /* @__PURE__ */ (() => {
  const $0 = runEffectFn1(_parseJSON);
  return (x) => {
    const $1 = (() => {
      const $1 = $0(x);
      return catchException((x$1) => () => $Either("Left", x$1))(() => {
        const a$p = $1();
        return $Either("Right", a$p);
      });
    })()();
    if ($1.tag === "Left") {
      return $Either("Left", $NonEmpty($ForeignError("ForeignError", message($1._1)), Nil));
    }
    if ($1.tag === "Right") {
      return $Either("Right", $1._1);
    }
    fail();
  };
})();
var readForeignFieldsCons = (dictIsSymbol) => (dictReadForeign) => {
  const readImpl5 = dictReadForeign.readImpl;
  return (dictReadForeignFields) => () => () => ({
    getFields: (v) => (obj) => {
      const name = dictIsSymbol.reflectSymbol($$Proxy);
      const $0 = dictReadForeignFields.getFields($$Proxy)(obj);
      const $1 = bindExceptT2.bind(readProp(name)(obj))(readImpl5);
      if ($1.tag === "Right") {
        if ($0.tag === "Right") {
          return $Either("Right", (x) => unsafeInsert(dictIsSymbol.reflectSymbol($$Proxy))($1._1)($0._1(x)));
        }
        if ($0.tag === "Left") {
          return $Either("Left", $0._1);
        }
        fail();
      }
      if ($1.tag === "Left") {
        if ($0.tag === "Left") {
          return $Either("Left", semigroupNonEmptyList.append((() => {
            const $2 = ErrorAtProperty(name);
            return $NonEmpty($2($1._1._1), listMap($2)($1._1._2));
          })())($0._1));
        }
        if ($0.tag === "Right") {
          return $Either("Left", (() => {
            const $2 = ErrorAtProperty(name);
            return $NonEmpty($2($1._1._1), listMap($2)($1._1._2));
          })());
        }
      }
      fail();
    }
  });
};

// output-es/Yoga.JSON.Generics.TaggedSumRep/index.js
var defaultOptions = { typeTag: "type", valueTag: "value", toConstructorName: (x) => x };

// output-es/Markgraf.Animation.Variables/index.js
var variableEditOptions = { ...defaultOptions, toConstructorName: /* @__PURE__ */ drop(4) };
var dictionaryValueOptions = { ...defaultOptions, toConstructorName: /* @__PURE__ */ drop(4) };

// output-es/Data.String.CodePoints/foreign.js
var hasArrayFrom = typeof Array.from === "function";
var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
var hasCodePointAt = typeof String.prototype.codePointAt === "function";
var _unsafeCodePointAt0 = function(fallback) {
  return hasCodePointAt ? function(str) {
    return str.codePointAt(0);
  } : fallback;
};
var _singleton = function(fallback) {
  return hasFromCodePoint ? String.fromCodePoint : fallback;
};
var _take = function(fallback) {
  return function(n) {
    if (hasStringIterator) {
      return function(str) {
        var accum = "";
        var iter = str[Symbol.iterator]();
        for (var i = 0;i < n; ++i) {
          var o = iter.next();
          if (o.done)
            return accum;
          accum += o.value;
        }
        return accum;
      };
    }
    return fallback(n);
  };
};
var _toCodePointArray = function(fallback) {
  return function(unsafeCodePointAt0) {
    if (hasArrayFrom) {
      return function(str) {
        return Array.from(str, unsafeCodePointAt0);
      };
    }
    return fallback;
  };
};
// output-es/Data.String.CodePoints/index.js
var uncons2 = (s) => {
  const v = length2(s);
  if (v === 0) {
    return Nothing;
  }
  if (v === 1) {
    return $Maybe("Just", { head: toCharCode(charAt(0)(s)), tail: "" });
  }
  const cu1 = toCharCode(charAt(1)(s));
  const cu0 = toCharCode(charAt(0)(s));
  if (55296 <= cu0 && cu0 <= 56319 && 56320 <= cu1 && cu1 <= 57343) {
    return $Maybe("Just", { head: (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0, tail: drop(2)(s) });
  }
  return $Maybe("Just", { head: cu0, tail: drop(1)(s) });
};
var unconsButWithTuple = (s) => {
  const $0 = uncons2(s);
  if ($0.tag === "Just") {
    return $Maybe("Just", $Tuple($0._1.head, $0._1.tail));
  }
  return Nothing;
};
var toCodePointArrayFallback = (s) => unfoldableArray.unfoldr(unconsButWithTuple)(s);
var unsafeCodePointAt0Fallback = (s) => {
  const cu0 = toCharCode(charAt(0)(s));
  if (55296 <= cu0 && cu0 <= 56319 && length2(s) > 1) {
    const cu1 = toCharCode(charAt(1)(s));
    if (56320 <= cu1 && cu1 <= 57343) {
      return (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0;
    }
  }
  return cu0;
};
var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
var indexOf2 = (p) => (s) => {
  const $0 = indexOf(p)(s);
  if ($0.tag === "Just") {
    return $Maybe("Just", toCodePointArray(take($0._1)(s)).length);
  }
  return Nothing;
};
var fromCharCode2 = (x) => singleton((() => {
  if (x >= 0 && x <= 65535) {
    return fromCharCode(x);
  }
  if (x < 0) {
    return "\x00";
  }
  return "￿";
})());
var singletonFallback = (v) => {
  if (v <= 65535) {
    return fromCharCode2(v);
  }
  return fromCharCode2(intDiv(v - 65536 | 0, 1024) + 55296 | 0) + fromCharCode2(intMod(v - 65536 | 0)(1024) + 56320 | 0);
};
var singleton2 = /* @__PURE__ */ _singleton(singletonFallback);
var takeFallback = (v) => (v1) => {
  if (v < 1) {
    return "";
  }
  const v2 = uncons2(v1);
  if (v2.tag === "Just") {
    return singleton2(v2._1.head) + takeFallback(v - 1 | 0)(v2._1.tail);
  }
  return v1;
};
var take2 = /* @__PURE__ */ _take(takeFallback);
// output-es/Promise.Internal/foreign.js
var newImpl2 = function(k) {
  return new Promise(k);
};
function thenOrCatch(k, c, p) {
  return p.then(k, c);
}
function resolve(a) {
  return Promise.resolve(a);
}
// output-es/Promise.Rejection/foreign.js
function fromError(a) {
  return a;
}
function _toError(just, nothing, ref) {
  if (ref instanceof Error) {
    return just(ref);
  }
  return nothing;
}
// output-es/Promise.Aff/index.js
var toAff$p = (customCoerce) => (p) => makeAff((cb) => () => {
  thenOrCatch(($0) => {
    const $1 = cb($Either("Right", $0));
    const a$p = $1();
    return resolve(a$p);
  }, ($0) => {
    const $1 = cb($Either("Left", customCoerce($0)));
    const a$p = $1();
    return resolve(a$p);
  }, p);
  return nonCanceler;
});
var fromAff = () => (aff) => () => newImpl2((onResolve, onReject) => {
  const $0 = runEffectFn1(onResolve);
  const $1 = runEffectFn1(onReject);
  const $2 = runAff((v2) => {
    if (v2.tag === "Left") {
      return $1(fromError(v2._1));
    }
    if (v2.tag === "Right") {
      return $0(v2._1);
    }
    fail();
  })(aff);
  $2();
});
var coerce = (rej) => {
  const $0 = _toError(Just, Nothing, rej);
  const $1 = unsafeReadTagged(monadIdentity)("String")(rej);
  const $2 = (() => {
    const $2 = (() => {
      if ($1.tag === "Left") {
        return Nothing;
      }
      if ($1.tag === "Right") {
        return $Maybe("Just", error($1._1));
      }
      fail();
    })();
    if ($0.tag === "Nothing") {
      return $2;
    }
    return $0;
  })();
  if ($2.tag === "Nothing") {
    return error("Promise failed, couldn't extract JS Error or String");
  }
  if ($2.tag === "Just") {
    return $2._1;
  }
  fail();
};
// output-es/Yoga.WebProletarian.Runtime/foreign.js
var monotonicNowMilliseconds = () => globalThis.performance.now();
// output-es/Markgraf.Animation.Player.Playback/index.js
var monotonicNowSec = () => {
  const a$p = monotonicNowMilliseconds();
  return a$p / 1000;
};

// output-es/Node.ChildProcess.Types/foreign.js
var fromKillSignalImpl = (fromInt, fromStr, sig) => {
  const ty = typeof sig;
  if (ty === "number")
    return fromInt(sig | 0);
  if (ty === "string")
    return fromStr(sig);
  throw new Error("Impossible. Got kill signal that was neither int nor string: " + sig);
};

// output-es/Node.ChildProcess.Types/index.js
var $Exit = (tag, _1) => ({ tag, _1 });
var showExit = {
  show: (v) => {
    if (v.tag === "Normally") {
      return "Normally " + showIntImpl(v._1);
    }
    if (v.tag === "BySignal") {
      const $0 = fromKillSignalImpl(Left, Right, v._1);
      if ($0.tag === "Left") {
        return "BySignal " + showIntImpl($0._1);
      }
      if ($0.tag === "Right") {
        return "BySignal " + showStringImpl($0._1);
      }
    }
    fail();
  }
};

// output-es/Node.Encoding/index.js
var $Encoding = (tag) => tag;
var UTF8 = /* @__PURE__ */ $Encoding("UTF8");
var Base64 = /* @__PURE__ */ $Encoding("Base64");

// output-es/Node.Errors.SystemError/foreign.js
var getField = (field, err) => err[field];
// output-es/Node.EventEmitter/foreign.js
var unsafeOn = (emitter, eventName, cb) => emitter.on(eventName, cb);

// output-es/Node.EventEmitter/index.js
var $EventHandle = (_1, _2) => ({ tag: "EventHandle", _1, _2 });

// output-es/Data.Options/index.js
var fromFoldable3 = /* @__PURE__ */ fromFoldable(foldableArray);

// output-es/Node.Process/foreign.js
import process from "process";
var abortImpl = process.abort ? () => process.abort() : null;
var channelRefImpl = process.channel && process.channel.ref ? () => process.channel.ref() : null;
var channelUnrefImpl = process.channel && process.channel.unref ? () => process.channel.unref() : null;
var debugPort = process.debugPort;
var disconnectImpl = process.disconnect ? () => process.disconnect() : null;
var unsafeGetEnv = () => process.env;
var pid = process.pid;
var platformStr = process.platform;
var ppid = process.ppid;
var stdin = process.stdin;
var stdout = process.stdout;
var stderr = process.stderr;
var stdinIsTTY = process.stdinIsTTY;
var stdoutIsTTY = process.stdoutIsTTY;
var stderrIsTTY = process.stderrIsTTY;
var version = process.version;
// output-es/Node.ReadLine/foreign.js
import readline from "node:readline";
var createInterfaceImpl = (options) => readline.createInterface({
  input: options.input,
  output: options.output,
  completer: options.completer && ((line) => {
    const res = options.completer(line)();
    return [res.completions, res.matched];
  }),
  terminal: options.terminal,
  history: options.history,
  historySize: options.historySize,
  removeHistoryDuplicates: options.removeHistoryDuplicates,
  prompt: options.prompt,
  crlfDelay: options.crlfDelay,
  escapeCodeTimeout: options.escapeCodeTimeout,
  tabSize: options.tabSize,
  signal: options.signal
});
var closeImpl = (rl) => rl.close();
// output-es/Node.ReadLine/index.js
var createInterface = (input) => (opts) => {
  const $0 = fromFoldable3([...opts, $Tuple("input", input)]);
  return () => createInterfaceImpl($0);
};

// output-es/Node.Buffer.Immutable/foreign.js
import { Buffer as Buffer2 } from "node:buffer";
var fromStringImpl3 = (str, encoding) => Buffer2.from(str, encoding);
var toStringImpl = (enc, buff) => buff.toString(enc);
// output-es/Node.Buffer.Immutable/index.js
var toString4 = (enc) => (buf) => toStringImpl((() => {
  if (enc === "ASCII") {
    return "ascii";
  }
  if (enc === "UTF8") {
    return "utf8";
  }
  if (enc === "UTF16LE") {
    return "utf16le";
  }
  if (enc === "UCS2") {
    return "ucs2";
  }
  if (enc === "Base64") {
    return "base64";
  }
  if (enc === "Base64Url") {
    return "base64url";
  }
  if (enc === "Latin1") {
    return "latin1";
  }
  if (enc === "Binary") {
    return "binary";
  }
  if (enc === "Hex") {
    return "hex";
  }
  fail();
})(), buf);
var fromString3 = (str) => (enc) => fromStringImpl3(str, (() => {
  if (enc === "ASCII") {
    return "ascii";
  }
  if (enc === "UTF8") {
    return "utf8";
  }
  if (enc === "UTF16LE") {
    return "utf16le";
  }
  if (enc === "UCS2") {
    return "ucs2";
  }
  if (enc === "Base64") {
    return "base64";
  }
  if (enc === "Base64Url") {
    return "base64url";
  }
  if (enc === "Latin1") {
    return "latin1";
  }
  if (enc === "Binary") {
    return "binary";
  }
  if (enc === "Hex") {
    return "hex";
  }
  fail();
})());

// output-es/Node.Stream/foreign.js
var writeStringImpl = (w, str, enc) => w.write(str, enc);
var endImpl = (w) => w.end();
// output-es/Node.Stream/index.js
var writeString = (w) => (enc) => (str) => {
  const $0 = (() => {
    if (enc === "ASCII") {
      return "ascii";
    }
    if (enc === "UTF8") {
      return "utf8";
    }
    if (enc === "UTF16LE") {
      return "utf16le";
    }
    if (enc === "UCS2") {
      return "ucs2";
    }
    if (enc === "Base64") {
      return "base64";
    }
    if (enc === "Base64Url") {
      return "base64url";
    }
    if (enc === "Latin1") {
      return "latin1";
    }
    if (enc === "Binary") {
      return "binary";
    }
    if (enc === "Hex") {
      return "hex";
    }
    fail();
  })();
  return () => writeStringImpl(w, str, $0);
};
// output-es/Node.UnsafeChildProcess.Safe/index.js
var show = /* @__PURE__ */ (() => showNullable(showInt).show)();
var closeH = /* @__PURE__ */ $EventHandle("close", (cb) => (code, signal) => {
  const v = nullable(signal, Nothing, Just);
  const v1 = nullable(code, Nothing, Just);
  if (v1.tag === "Just") {
    return cb($Exit("Normally", v1._1))();
  }
  if (v.tag === "Just") {
    return cb($Exit("BySignal", v._1))();
  }
  return _crashWith("Impossible. 'close' event did not get an exit code or kill signal: " + show(code) + "; " + signal)();
});

// output-es/Node.UnsafeChildProcess.Unsafe/foreign.js
import {
  exec,
  exec as exec2,
  exec as exec3,
  exec as exec4,
  execFile,
  execFile as execFile2,
  execFile as execFile3,
  execFile as execFile4,
  spawn,
  spawn as spawn2,
  execSync,
  execSync as execSync2,
  execFileSync,
  execFileSync as execFileSync2,
  spawnSync,
  spawnSync as spawnSync2,
  fork,
  fork as fork2
} from "node:child_process";
var unsafeStdin = (cp) => cp.stdin;
var unsafeStdout = (cp) => cp.stdout;
var unsafeStderr = (cp) => cp.stderr;
// output-es/Markgraf.Terminal.Native/index.js
var $Event = (tag, _1) => ({ tag, _1 });
var show2 = /* @__PURE__ */ (() => showNonEmptyList(showForeignError).show)();
var read2 = /* @__PURE__ */ (() => {
  const $0 = readForeignFieldsCons({ reflectSymbol: () => "event" })(readForeignString)(readForeignFieldsNilRowRo)()();
  return (x) => {
    const $1 = $0.getFields($$Proxy)(x);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return $Either("Right", $1._1({}));
    }
    fail();
  };
})();
var readForeignArray2 = /* @__PURE__ */ readForeignArray(readForeignInt);
var read1 = /* @__PURE__ */ (() => {
  const $0 = readForeignFieldsCons({ reflectSymbol: () => "duration" })(readForeignNumber)(readForeignFieldsCons({ reflectSymbol: () => "fps" })(readForeignInt)(readForeignFieldsCons({
    reflectSymbol: () => "keyframeFrames"
  })(readForeignArray2)(readForeignFieldsCons({ reflectSymbol: () => "sceneFrames" })(readForeignArray2)(readForeignFieldsNilRowRo)()())()())()())()();
  return (x) => {
    const $1 = $0.getFields($$Proxy)(x);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return $Either("Right", $1._1({}));
    }
    fail();
  };
})();
var heightIsSymbol = { reflectSymbol: () => "height" };
var idIsSymbol = { reflectSymbol: () => "id" };
var readForeignFieldsCons2 = /* @__PURE__ */ readForeignFieldsCons(idIsSymbol)(readForeignInt);
var indexIsSymbol = { reflectSymbol: () => "index" };
var widthIsSymbol = { reflectSymbol: () => "width" };
var read22 = /* @__PURE__ */ (() => {
  const $0 = readForeignFieldsCons({ reflectSymbol: () => "byteLength" })(readForeignInt)(readForeignFieldsCons(heightIsSymbol)(readForeignInt)(readForeignFieldsCons2(readForeignFieldsCons(indexIsSymbol)(readForeignInt)(readForeignFieldsCons({
    reflectSymbol: () => "name"
  })(readForeignString)(readForeignFieldsCons(widthIsSymbol)(readForeignInt)(readForeignFieldsNilRowRo)()())()())()())()())()())()();
  return (x) => {
    const $1 = $0.getFields($$Proxy)(x);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return $Either("Right", $1._1({}));
    }
    fail();
  };
})();
var read3 = /* @__PURE__ */ (() => {
  const $0 = readForeignFieldsCons2(readForeignFieldsNilRowRo)()();
  return (x) => {
    const $1 = $0.getFields($$Proxy)(x);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return $Either("Right", $1._1({}));
    }
    fail();
  };
})();
var read4 = /* @__PURE__ */ (() => {
  const $0 = readForeignFieldsCons({ reflectSymbol: () => "message" })(readForeignString)(readForeignFieldsNilRowRo)()();
  return (x) => {
    const $1 = $0.getFields($$Proxy)(x);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return $Either("Right", $1._1({}));
    }
    fail();
  };
})();
var writeJSON2 = /* @__PURE__ */ writeJSON(/* @__PURE__ */ (() => {
  const $0 = writeForeignFieldsCons(heightIsSymbol)(writeForeignInt)(writeForeignFieldsCons(indexIsSymbol)(writeForeignInt)(writeForeignFieldsCons({
    reflectSymbol: () => "op"
  })(writeForeignString)(writeForeignFieldsCons(widthIsSymbol)(writeForeignInt)(writeForeignFieldsNilRowR)()()())()()())()()())()()();
  return { writeImpl: (rec) => $0.writeImplFields($$Proxy)(rec)({}) };
})());
var writeJSON1 = /* @__PURE__ */ writeJSON(/* @__PURE__ */ (() => {
  const $0 = writeForeignFieldsCons(idIsSymbol)(writeForeignInt)(writeForeignFieldsCons({ reflectSymbol: () => "op" })(writeForeignString)(writeForeignFieldsNilRowR)()()())()()();
  return { writeImpl: (rec) => $0.writeImplFields($$Proxy)(rec)({}) };
})());
var decode = (line) => {
  const $0 = bindExceptT2.bind(parseJSON(line))(applicativeExceptT2.pure);
  const $1 = (() => {
    if ($0.tag === "Left") {
      return $Either("Left", show2($0._1));
    }
    if ($0.tag === "Right") {
      return $Either("Right", $0._1);
    }
    fail();
  })();
  return (() => {
    if ($1.tag === "Left") {
      const $2 = $1._1;
      return (v) => $Either("Left", $2);
    }
    if ($1.tag === "Right") {
      const $2 = $1._1;
      return (f) => f($2);
    }
    fail();
  })()((value) => {
    const $2 = read2(value);
    if ($2.tag === "Left") {
      return $Either("Left", show2($2._1));
    }
    if ($2.tag === "Right") {
      if ($2._1.event === "ready") {
        const $3 = read1(value);
        if ($3.tag === "Left") {
          return $Either("Left", show2($3._1));
        }
        if ($3.tag === "Right") {
          return $Either("Right", $Event("Ready", $3._1));
        }
        fail();
      }
      if ($2._1.event === "frame") {
        const $3 = read22(value);
        if ($3.tag === "Left") {
          return $Either("Left", show2($3._1));
        }
        if ($3.tag === "Right") {
          return $Either("Right", $Event("Rendered", $3._1));
        }
        fail();
      }
      if ($2._1.event === "consumed") {
        const $3 = read3(value);
        if ($3.tag === "Left") {
          return $Either("Left", show2($3._1));
        }
        if ($3.tag === "Right") {
          return $Either("Right", $Event("Consumed", $3._1.id));
        }
        fail();
      }
      if ($2._1.event === "error") {
        const $3 = read4(value);
        if ($3.tag === "Left") {
          return $Either("Left", show2($3._1));
        }
        if ($3.tag === "Right") {
          return $Either("Right", $Event("Failed", $3._1.message));
        }
        fail();
      }
      return $Either("Left", "Unknown event: " + $2._1.event);
    }
    fail();
  });
};
var launch = (executable) => (path) => (theme) => (transparency) => (receive) => (failed) => {
  const $0 = [
    path,
    "--frame-server",
    "--theme",
    (() => {
      if (theme === "Light") {
        return "light";
      }
      if (theme === "Dark") {
        return "dark";
      }
      if (theme === "Blueprint") {
        return "blueprint";
      }
      if (theme === "Whiteboard") {
        return "whiteboard";
      }
      if (theme === "Isometric") {
        return "isometric";
      }
      fail();
    })(),
    "--max-width",
    "1440",
    "--max-height",
    "720",
    ...transparency === "PaintBackground" ? ["--background"] : []
  ];
  return () => {
    const child = spawn(executable, $0);
    let closing = false;
    let exited = false;
    let diagnostic = Nothing;
    const output = createInterface(unsafeStdout(child))([])();
    const errors = createInterface(unsafeStderr(child))([])();
    const send = (value) => () => {
      const stopped = closing;
      const $1 = writeString(unsafeStdin(child))(UTF8)(value + `
`);
      if (!stopped) {
        $1();
        return;
      }
      if (stopped) {
        return;
      }
      fail();
    };
    const report = (reason) => () => {
      const stopped = closing;
      const $1 = failed(reason);
      if (!stopped) {
        return $1();
      }
      if (stopped) {
        return;
      }
      fail();
    };
    unsafeOn(child, "error", (err) => report(getField("message", err) + (getField("code", err) === "ENOENT" ? `
The packaged native renderer is missing. Reinstall or rebuild the Markgraf agent integration package.` : ""))());
    unsafeOn(unsafeStdin(child), "error", (x) => report(message(x))());
    unsafeOn(unsafeStdout(child), "error", (x) => report(message(x))());
    unsafeOn(unsafeStderr(child), "error", (x) => report(message(x))());
    unsafeOn(errors, "line", (line) => diagnostic = $Maybe("Just", line));
    unsafeOn(output, "line", (line) => {
      const v = decode(line);
      if (v.tag === "Left") {
        return report("Invalid native frame response: " + v._1)();
      }
      if (v.tag === "Right") {
        return receive(v._1)();
      }
      fail();
    });
    unsafeOn(child, closeH._1, closeH._2((status) => () => {
      exited = true;
      closeImpl(output);
      closeImpl(errors);
      const detail = diagnostic;
      return report((() => {
        const $1 = "Native Markgraf exited: " + showExit.show(status);
        if (detail.tag === "Nothing") {
          return $1;
        }
        if (detail.tag === "Just") {
          return detail._1;
        }
        fail();
      })())();
    }));
    return {
      frame: (index) => (width) => (height) => send(writeJSON2({ op: "frame", index, width, height })),
      consume: (id) => send(writeJSON1({ op: "consume", id })),
      release: (id) => send(writeJSON1({ op: "release", id })),
      close: () => {
        const stopped = closing;
        if (!stopped) {
          closing = true;
          const finished = exited;
          const $1 = unsafeStdin(child);
          if (!finished) {
            return endImpl($1);
          }
          if (finished) {
            return;
          }
          fail();
        }
        if (stopped) {
          return;
        }
        fail();
      }
    };
  };
};

// output-es/Node.OS/foreign.js
import {
  EOL,
  arch,
  constants,
  cpus,
  devNull,
  endianness,
  freemem,
  getPriority,
  homedir,
  hostname,
  loadavg,
  machine,
  networkInterfaces,
  release,
  setPriority,
  tmpdir,
  totalmem,
  type,
  uptime as uptime2,
  userInfo,
  version as version2
} from "node:os";

// output-es/Node.OS/index.js
var $Arch = (tag, _1) => ({ tag, _1 });
var Arm = /* @__PURE__ */ $Arch("Arm");
var Arm64 = /* @__PURE__ */ $Arch("Arm64");
var Ia32 = /* @__PURE__ */ $Arch("Ia32");
var MIPS = /* @__PURE__ */ $Arch("MIPS");
var MIPSEL = /* @__PURE__ */ $Arch("MIPSEL");
var PPC = /* @__PURE__ */ $Arch("PPC");
var PPC64 = /* @__PURE__ */ $Arch("PPC64");
var S390 = /* @__PURE__ */ $Arch("S390");
var S390X = /* @__PURE__ */ $Arch("S390X");
var X32 = /* @__PURE__ */ $Arch("X32");
var X64 = /* @__PURE__ */ $Arch("X64");
var arch2 = () => {
  const a$p = arch();
  if (a$p === "arm") {
    return Arm;
  }
  if (a$p === "arm64") {
    return Arm64;
  }
  if (a$p === "ia32") {
    return Ia32;
  }
  if (a$p === "mips") {
    return MIPS;
  }
  if (a$p === "mipsel") {
    return MIPSEL;
  }
  if (a$p === "ppc") {
    return PPC;
  }
  if (a$p === "ppc64") {
    return PPC64;
  }
  if (a$p === "s390") {
    return S390;
  }
  if (a$p === "s390x") {
    return S390X;
  }
  if (a$p === "x32") {
    return X32;
  }
  if (a$p === "x64") {
    return X64;
  }
  return $Arch("UnknownArch", a$p);
};

// output-es/Node.Path/foreign.js
import path from "node:path";
var normalize = path.normalize;
function concat3(segments) {
  return path.join.apply(this, segments);
}
function resolve2(from) {
  return (to) => () => path.resolve.apply(this, from.concat([to]));
}
var basename = path.basename;
var extname = path.extname;
var sep = path.sep;
var delimiter = path.delimiter;
var parse2 = path.parse;
var isAbsolute = path.isAbsolute;
// output-es/Markgraf.Terminal.Player/index.js
var $Acknowledgement = (tag, _1) => ({ tag, _1 });
var $Input = (tag, _1) => ({ tag, _1 });
var $Pipeline = (tag, _1, _2) => ({ tag, _1, _2 });
var min3 = (x) => (y) => {
  const v = ordNumber.compare(x)(y);
  if (v === "LT") {
    return x;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return y;
  }
  fail();
};
var max2 = (x) => (y) => {
  const v = ordNumber.compare(x)(y);
  if (v === "LT") {
    return y;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return x;
  }
  fail();
};
var max1 = (x) => (y) => {
  const v = ordInt.compare(x)(y);
  if (v === "LT") {
    return y;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return x;
  }
  fail();
};
var min1 = (x) => (y) => {
  const v = ordInt.compare(x)(y);
  if (v === "LT") {
    return x;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return y;
  }
  fail();
};
var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
var identity8 = (x) => x;
var Idle = /* @__PURE__ */ $Pipeline("Idle");
var Close = /* @__PURE__ */ $Input("Close");
var TogglePlayback = /* @__PURE__ */ $Input("TogglePlayback");
var Restart = /* @__PURE__ */ $Input("Restart");
var PreviousKeyframe = /* @__PURE__ */ $Input("PreviousKeyframe");
var NextKeyframe = /* @__PURE__ */ $Input("NextKeyframe");
var PreviousScene = /* @__PURE__ */ $Input("PreviousScene");
var NextScene = /* @__PURE__ */ $Input("NextScene");
var Consumed2 = /* @__PURE__ */ $Acknowledgement("Consumed");
var seconds = /* @__PURE__ */ toStringWith(/* @__PURE__ */ $Format("Fixed", /* @__PURE__ */ clamp(0)(20)(2)));
var resolve3 = (root) => (cwd) => (options) => _bind((() => {
  const $0 = platformStr === "darwin";
  const $1 = _throwError(error("Native inline playback requires macOS Metal."));
  if (!$0) {
    return $1;
  }
  if ($0) {
    return _pure();
  }
  fail();
})())(() => {
  const path = trim(options.path);
  return _bind((() => {
    const $0 = _throwError(error("Usage: /markgraf [--background] path/to/animation.markgraf"));
    if (path === "") {
      return $0;
    }
    return _pure();
  })())(() => _bind(_liftEffect(arch2))((architecture) => _bind(architecture.tag === "Arm64" ? _pure() : _throwError(error("Native inline playback requires Apple Silicon macOS.")))(() => _bind(_liftEffect(resolve2([
    cwd
  ])(path)))((absolute) => _pure({
    executable: concat3([root, "native", "Markgraf Editor.app", "Contents", "MacOS", "markgraf"]),
    path: absolute,
    transparency: options.transparency,
    position: { time: 0, playing: true }
  })))));
});
var previousStopAt = (previousStopAt$a0$copy) => (previousStopAt$a1$copy) => (previousStopAt$a2$copy) => (previousStopAt$a3$copy) => (previousStopAt$a4$copy) => {
  let previousStopAt$a0 = previousStopAt$a0$copy;
  let previousStopAt$a1 = previousStopAt$a1$copy;
  let previousStopAt$a2 = previousStopAt$a2$copy;
  let previousStopAt$a3 = previousStopAt$a3$copy;
  let previousStopAt$a4 = previousStopAt$a4$copy;
  let previousStopAt$c = true;
  let previousStopAt$r;
  while (previousStopAt$c) {
    const frames = previousStopAt$a0, current = previousStopAt$a1, lower = previousStopAt$a2, upper = previousStopAt$a3, result = previousStopAt$a4;
    if (lower > upper) {
      previousStopAt$c = false;
      previousStopAt$r = result;
      continue;
    }
    const middle = intDiv(lower + upper | 0, 2);
    if (middle >= 0 && middle < frames.length) {
      if (frames[middle] < current) {
        previousStopAt$a0 = frames;
        previousStopAt$a1 = current;
        previousStopAt$a2 = middle + 1 | 0;
        previousStopAt$a3 = upper;
        previousStopAt$a4 = frames[middle];
        continue;
      }
      previousStopAt$a0 = frames;
      previousStopAt$a1 = current;
      previousStopAt$a2 = lower;
      previousStopAt$a3 = middle - 1 | 0;
      previousStopAt$a4 = result;
      continue;
    }
    previousStopAt$c = false;
    previousStopAt$r = result;
  }
  return previousStopAt$r;
};
var playhead = (state) => (now) => min3(state.duration)(max2(0)(state.playing ? state.baseTime + (now - state.epoch) : state.baseTime + 0));
var nextStopAt = (nextStopAt$a0$copy) => (nextStopAt$a1$copy) => (nextStopAt$a2$copy) => (nextStopAt$a3$copy) => (nextStopAt$a4$copy) => {
  let nextStopAt$a0 = nextStopAt$a0$copy;
  let nextStopAt$a1 = nextStopAt$a1$copy;
  let nextStopAt$a2 = nextStopAt$a2$copy;
  let nextStopAt$a3 = nextStopAt$a3$copy;
  let nextStopAt$a4 = nextStopAt$a4$copy;
  let nextStopAt$c = true;
  let nextStopAt$r;
  while (nextStopAt$c) {
    const frames = nextStopAt$a0, current = nextStopAt$a1, lower = nextStopAt$a2, upper = nextStopAt$a3, result = nextStopAt$a4;
    if (lower > upper) {
      nextStopAt$c = false;
      nextStopAt$r = result;
      continue;
    }
    const middle = intDiv(lower + upper | 0, 2);
    if (middle >= 0 && middle < frames.length) {
      if (frames[middle] > current) {
        nextStopAt$a0 = frames;
        nextStopAt$a1 = current;
        nextStopAt$a2 = lower;
        nextStopAt$a3 = middle - 1 | 0;
        nextStopAt$a4 = frames[middle];
        continue;
      }
      nextStopAt$a0 = frames;
      nextStopAt$a1 = current;
      nextStopAt$a2 = middle + 1 | 0;
      nextStopAt$a3 = upper;
      nextStopAt$a4 = result;
      continue;
    }
    nextStopAt$c = false;
    nextStopAt$r = result;
  }
  return nextStopAt$r;
};
var fitViewport = (size) => {
  const rows = max1(1)(min1(unsafeClamp(floor(720 / size.cellHeight)))(min1(18)(intDiv(size.rows - 6 | 0, 2))));
  const columns = max1(1)(min1(unsafeClamp(floor(1440 / size.cellWidth)))(min1(297)(size.columns - 2 | 0)));
  return {
    width: max1(1)(min1(1440)(unsafeClamp(floor(toNumber(columns) * size.cellWidth)))),
    height: max1(1)(min1(720)(unsafeClamp(floor(toNumber(rows) * size.cellHeight)))),
    columns,
    rows
  };
};
var create = (options) => (surface) => {
  const $0 = surface.viewport;
  return () => {
    const initial = $0();
    let stateRef = {
      ready: false,
      duration: 0,
      fps: 120,
      sceneFrames: [],
      keyframeFrames: [],
      playing: options.position.playing,
      baseTime: options.position.time,
      epoch: 0,
      revision: 0,
      shownRevision: -1,
      shownIndex: -1,
      pipeline: Idle,
      size: initial,
      visible: false,
      alt: false,
      disposed: false
    };
    let processRef = Nothing;
    let tickRef = Nothing;
    let acknowledgementRef = Nothing;
    let unsubscribeInputRef = Nothing;
    let unsubscribePaintRef = Nothing;
    const pump$lazy = binding(() => {
      const $1 = traverse_2(clearTimeoutImpl);
      return () => {
        const $2 = tickRef;
        $1($2)();
        tickRef = Nothing;
        const state = stateRef;
        const active = surface.active();
        const $3 = state.pipeline.tag === "Idle" ? () => {
          const v = monotonicNowSec();
          const time = playhead(state)(v);
          const index = (() => {
            if (time >= state.duration) {
              return unsafeClamp(ceil(state.duration * toNumber(state.fps)));
            }
            if (state.playing) {
              return unsafeClamp(floor(time * toNumber(state.fps)));
            }
            return unsafeClamp(round(time * toNumber(state.fps)));
          })();
          if (index !== state.shownIndex || state.revision !== state.shownRevision) {
            const $3 = stateRef;
            stateRef = { ...$3, pipeline: $Pipeline("Rendering", { revision: state.revision, index, size: state.size }) };
            const $4 = processRef;
            return traverse_2(($$native) => $$native.frame(index)(state.size.width)(state.size.height))($4)();
          }
          const $3 = setTimeoutImpl(max1(1)(unsafeClamp(ceil((state.epoch + (toNumber(index + 1 | 0) / toNumber(state.fps) - state.baseTime) - v) * 1000))))(pump$lazy());
          if (state.playing && time < state.duration) {
            const timer = $3();
            return tickRef = $Maybe("Just", timer);
          }
        } : () => {};
        if (state.ready && state.visible && active && !state.disposed) {
          return $3();
        }
      };
    });
    const pump = pump$lazy();
    const seek = (index, playing) => () => {
      const v = monotonicNowSec();
      const $1 = stateRef;
      stateRef = { ...$1, baseTime: max2(0)(min3($1.duration)(toNumber(index) / toNumber($1.fps))), epoch: v, playing, revision: $1.revision + 1 | 0 };
      surface.requestRender();
      return pump();
    };
    const $1 = traverse_2(clearTimeoutImpl);
    const stopTransport = () => {
      const $2 = acknowledgementRef;
      $1($2)();
      acknowledgementRef = Nothing;
      const $3 = unsubscribeInputRef;
      traverse_2(identity8)($3)();
      unsubscribeInputRef = Nothing;
      const $4 = processRef;
      return traverse_2((v) => v.close)($4)();
    };
    const cleanup = () => {
      const state = stateRef;
      if (!state.disposed) {
        const $2 = stateRef;
        stateRef = { ...$2, disposed: true, visible: false };
        const $3 = tickRef;
        traverse_2(clearTimeoutImpl)($3)();
        tickRef = Nothing;
        const $4 = unsubscribePaintRef;
        traverse_2(identity8)($4)();
        unsubscribePaintRef = Nothing;
        surface.releaseImage();
        surface.requestRender();
        if (state.pipeline.tag === "AwaitingAcknowledgement") {
          const $5 = state.pipeline._2;
          const $6 = stateRef;
          stateRef = { ...$6, pipeline: $Pipeline("AwaitingConsumption", state.pipeline._1, $5) };
          const $7 = processRef;
          return traverse_2(($$native) => $$native.consume($5))($7)();
        }
        if (state.pipeline.tag === "AwaitingConsumption") {
          return;
        }
        return stopTransport();
      }
      if (state.disposed) {
        return;
      }
      fail();
    };
    const finish = (result) => () => {
      const state = stateRef;
      if (!state.disposed) {
        cleanup();
        return surface.done(result)();
      }
      if (state.disposed) {
        return;
      }
      fail();
    };
    const completeTransfer = (request) => {
      const $2 = traverse_2(clearTimeoutImpl);
      return () => {
        const $3 = acknowledgementRef;
        $2($3)();
        acknowledgementRef = Nothing;
        const state = stateRef;
        const reachedEnd = request.revision === state.revision && request.index >= unsafeClamp(ceil(state.duration * toNumber(state.fps)));
        const previous = max2(0)(toNumber(state.shownIndex) / toNumber(state.fps));
        const looping = reachedEnd && state.playing && state.duration > 0;
        const current = min3(state.duration)(toNumber(request.index) / toNumber(state.fps));
        const $4 = stateRef;
        stateRef = {
          ...$4,
          pipeline: Idle,
          shownIndex: request.index,
          shownRevision: request.revision,
          playing: $4.playing && (!reachedEnd || looping),
          baseTime: (() => {
            if (looping) {
              return 0;
            }
            if (reachedEnd) {
              return $4.duration;
            }
            return $4.baseTime;
          })(),
          epoch: looping ? $4.epoch + $4.duration - $4.baseTime : $4.epoch
        };
        if (state.disposed) {
          return stopTransport();
        }
        if (request.revision !== state.shownRevision || reachedEnd || unsafeClamp(floor(current * 4)) !== unsafeClamp(floor(previous * 4))) {
          surface.requestRender();
        }
        return pump();
      };
    };
    const unsubscribeInput = surface.onAcknowledgement((response) => () => {
      const state = stateRef;
      if (state.pipeline.tag === "AwaitingAcknowledgement") {
        if (response.tag === "Accepted") {
          const $2 = stateRef;
          stateRef = { ...$2, pipeline: $Pipeline("AwaitingConsumption", state.pipeline._1, state.pipeline._2) };
          const $3 = processRef;
          return traverse_2(($$native) => $$native.consume(state.pipeline._2))($3)();
        }
        if (response.tag === "Consumed") {
          const $2 = processRef;
          traverse_2(($$native) => $$native.release(state.pipeline._2))($2)();
          return completeTransfer(state.pipeline._1)();
        }
        if (response.tag === "Discarded") {
          const $2 = acknowledgementRef;
          traverse_2(clearTimeoutImpl)($2)();
          acknowledgementRef = Nothing;
          const $3 = processRef;
          traverse_2(($$native) => $$native.release(state.pipeline._2))($3)();
          const $4 = stateRef;
          stateRef = { ...$4, pipeline: Idle };
          if (state.disposed) {
            return stopTransport();
          }
          return pump();
        }
        if (response.tag === "Rejected") {
          const $2 = acknowledgementRef;
          traverse_2(clearTimeoutImpl)($2)();
          acknowledgementRef = Nothing;
          const $3 = processRef;
          traverse_2(($$native) => $$native.release(state.pipeline._2))($3)();
          const $4 = stateRef;
          stateRef = { ...$4, pipeline: Idle };
          if (state.disposed) {
            return stopTransport();
          }
          return finish($Either("Left", response._1))();
        }
        fail();
      }
    })();
    unsubscribeInputRef = $Maybe("Just", unsubscribeInput);
    const unsubscribePaint = surface.onPaint((paint) => () => {
      const state = stateRef;
      const refreshed = paint.reset || paint.alt !== state.alt || paint.visible && !state.visible;
      if (!state.disposed) {
        const $2 = stateRef;
        stateRef = { ...$2, visible: paint.visible, alt: paint.alt, revision: refreshed ? $2.revision + 1 | 0 : $2.revision };
        return pump();
      }
      if (state.disposed) {
        return;
      }
      fail();
    })();
    unsubscribePaintRef = $Maybe("Just", unsubscribePaint);
    const $2 = launch(options.executable)(options.path)(surface.theme)(options.transparency)((event) => () => {
      const state = stateRef;
      if (event.tag === "Ready") {
        if (!state.disposed) {
          const v = monotonicNowSec();
          const $2 = stateRef;
          stateRef = {
            ...$2,
            ready: true,
            duration: event._1.duration,
            fps: event._1.fps,
            sceneFrames: event._1.sceneFrames,
            keyframeFrames: event._1.keyframeFrames,
            epoch: v,
            baseTime: max2(0)(min3(event._1.duration)(state.baseTime))
          };
          surface.requestRender();
          return pump();
        }
        return;
      }
      if (event.tag === "Rendered") {
        if (state.pipeline.tag === "Rendering") {
          const active = surface.active();
          if (state.disposed || !state.visible || !active || state.pipeline._1.revision !== state.revision) {
            const $2 = processRef;
            traverse_2(($$native) => $$native.release(event._1.id))($2)();
            const $3 = stateRef;
            stateRef = { ...$3, pipeline: Idle };
            if (!state.disposed) {
              return pump();
            }
            if (state.disposed) {
              return;
            }
            fail();
          }
          const $2 = stateRef;
          stateRef = { ...$2, pipeline: $Pipeline("AwaitingAcknowledgement", state.pipeline._1, event._1.id) };
          const timer = setTimeoutImpl(5000)(() => {
            const $3 = stateRef;
            const expired = stateRef = { ...$3, pipeline: Idle };
            if (expired.disposed) {
              return stopTransport();
            }
            return finish($Either("Left", "Kitty did not acknowledge the shared-memory frame. Inline playback requires a local terminal."))();
          })();
          acknowledgementRef = $Maybe("Just", timer);
          const $3 = surface.transmit(state.pipeline._1.size.columns)(state.pipeline._1.size.rows)(event._1);
          const sent = catchException((x) => () => $Either("Left", x))(() => {
            const a$p = $3();
            return $Either("Right", a$p);
          })();
          if (sent.tag === "Left") {
            const $4 = stateRef;
            stateRef = { ...$4, pipeline: Idle };
            return finish($Either("Left", message(sent._1)))();
          }
          if (sent.tag === "Right") {
            return;
          }
          fail();
        }
        const $2 = finish($Either("Left", "Native renderer sent an unsolicited frame."));
        if (!state.disposed) {
          return $2();
        }
        if (state.disposed) {
          return;
        }
        fail();
      }
      if (event.tag === "Consumed") {
        if (state.pipeline.tag === "AwaitingConsumption" && event._1 === state.pipeline._2) {
          return completeTransfer(state.pipeline._1)();
        }
        const $2 = finish($Either("Left", "Native renderer consumed an unexpected frame."));
        if (!state.disposed) {
          return $2();
        }
        if (state.disposed) {
          return;
        }
        fail();
      }
      if (event.tag === "Failed") {
        return finish($Either("Left", event._1))();
      }
    })((reason) => finish($Either("Left", reason)));
    const launched = catchException((x) => () => $Either("Left", x))(() => {
      const a$p = $2();
      return $Either("Right", a$p);
    })();
    if (launched.tag === "Left") {
      cleanup();
      return throwException(launched._1)();
    }
    if (launched.tag === "Right") {
      processRef = $Maybe("Just", launched._1);
      return {
        render: () => {
          const current = surface.viewport();
          const previous = stateRef;
          if (!(current.columns === previous.size.columns && current.height === previous.size.height && current.rows === previous.size.rows && current.width === previous.size.width)) {
            const $3 = stateRef;
            stateRef = { ...$3, size: current, visible: false, revision: $3.revision + 1 | 0 };
          }
          const state = stateRef;
          const allowed = surface.observeImage();
          const time = max2(0)(min3(state.duration)(toNumber(state.shownIndex) / toNumber(state.fps)));
          return {
            status: basename(options.path) + " · " + (!state.ready ? "Starting native Metal renderer..." : seconds(time) + "/" + seconds(state.duration) + "s · " + (state.playing ? "playing" : "paused")),
            ready: state.ready,
            footer: "space play/pause · ←/→ keyframe · ↑/↓ scene · [/] frame · home · q/esc",
            size: state.size,
            imageVisible: allowed
          };
        },
        input: (action) => () => {
          const state = stateRef;
          const v = monotonicNowSec();
          const time = playhead(state)(v);
          const index = (() => {
            if (time >= state.duration) {
              return unsafeClamp(ceil(state.duration * toNumber(state.fps)));
            }
            if (state.playing) {
              return unsafeClamp(floor(time * toNumber(state.fps)));
            }
            return unsafeClamp(round(time * toNumber(state.fps)));
          })();
          if (action.tag === "Close") {
            return finish($Either("Right", undefined))();
          }
          if (action.tag === "TogglePlayback") {
            const $3 = seek(!state.playing && time >= state.duration ? 0 : index, !state.playing);
            if (state.ready) {
              return $3();
            }
            return;
          }
          if (action.tag === "Restart") {
            const $3 = seek(0, state.playing);
            if (state.ready) {
              return $3();
            }
            return;
          }
          if (action.tag === "Step") {
            const $3 = seek(index + action._1 | 0, false);
            if (state.ready) {
              return $3();
            }
            return;
          }
          if (action.tag === "PreviousKeyframe") {
            const $3 = seek(previousStopAt(state.keyframeFrames)(index)(0)(state.keyframeFrames.length - 1 | 0)(0), false);
            if (state.ready) {
              return $3();
            }
            return;
          }
          if (action.tag === "NextKeyframe") {
            const $3 = seek(nextStopAt(state.keyframeFrames)(index)(0)(state.keyframeFrames.length - 1 | 0)(index), false);
            if (state.ready) {
              return $3();
            }
            return;
          }
          if (action.tag === "PreviousScene") {
            const $3 = seek(previousStopAt(state.sceneFrames)(index)(0)(state.sceneFrames.length - 1 | 0)(0), false);
            if (state.ready) {
              return $3();
            }
            return;
          }
          if (action.tag === "NextScene") {
            const $3 = seek(nextStopAt(state.sceneFrames)(index)(0)(state.sceneFrames.length - 1 | 0)(index), false);
            if (state.ready) {
              return $3();
            }
            return;
          }
          fail();
        },
        snapshot: () => {
          const state = stateRef;
          const v = monotonicNowSec();
          return { time: state.ready ? playhead(state)(v) : max2(0)(state.baseTime), playing: state.playing, idle: state.pipeline.tag === "Idle" };
        },
        shownMoment: () => {
          const state = stateRef;
          return state.ready && state.visible && !state.disposed && state.shownIndex >= 0 ? $Maybe("Just", { time: min3(state.duration)(toNumber(state.shownIndex) / toNumber(state.fps)), frame: state.shownIndex, fps: state.fps }) : Nothing;
        },
        dispose: cleanup
      };
    }
    fail();
  };
};
var commandOptions = (requested) => {
  const path = trim(requested);
  const v = stripPrefix("--background")(path);
  if (v.tag === "Just" && (v._1 === "" || trim(v._1) !== v._1)) {
    return { path: trim(v._1), transparency: PaintBackground };
  }
  return { path, transparency: TransparentBackground };
};

// output-es/Omp.UI/foreign.js
var pasteToEditor = (context) => (text) => () => {
  const ui = context?.ui;
  if (typeof ui?.pasteToEditor !== "function")
    return false;
  ui.pasteToEditor(text);
  return true;
};
// output-es/Markgraf.Omp/index.js
var traverse_3 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
var writeJSON3 = /* @__PURE__ */ writeJSON(/* @__PURE__ */ (() => {
  const $0 = writeForeignFieldsCons({ reflectSymbol: () => "fps" })(writeForeignInt)(writeForeignFieldsCons({ reflectSymbol: () => "frame" })(writeForeignInt)(writeForeignFieldsCons({
    reflectSymbol: () => "path"
  })(writeForeignString)(writeForeignFieldsCons({ reflectSymbol: () => "timeSeconds" })(writeForeignNumber)(writeForeignFieldsNilRowR)()()())()()())()()())()()();
  return { writeImpl: (rec) => $0.writeImplFields($$Proxy)(rec)({}) };
})());
var createPlayer = (request) => (surface) => {
  const $0 = createImage(surface.tui);
  return () => {
    const image = $0();
    let rowsRef = { columns: 0, rows: 0, lines: [] };
    const player = create(request)({
      viewport: (() => {
        const $1 = size(surface.tui);
        return () => {
          const a$p = $1();
          return fitViewport(a$p);
        };
      })(),
      active: () => true,
      observeImage: observeImage(surface.tui)(image),
      transmit: transmit(surface.tui)(image),
      onAcknowledgement: (acknowledge) => onAcknowledgement(surface.tui)(image)((x) => acknowledge(x === "OK" ? Consumed2 : $Acknowledgement("Rejected", "Kitty shared-memory transfer failed: " + x))),
      onPaint: onPaint(surface.tui)(image),
      releaseImage: releaseImage(surface.tui)(image),
      requestRender: requestRender(surface.tui),
      done: (x) => surface.done((() => {
        if (x.tag === "Left") {
          return $Either("Left", x._1);
        }
        if (x.tag === "Right") {
          return $Either("Right", Nothing);
        }
        fail();
      })()),
      theme: isLight(surface.theme) ? Light : Dark
    })();
    return {
      render: (width) => {
        const $1 = player.render;
        return () => {
          const view = $1();
          const cached = rowsRef;
          const rows = (() => {
            if (!view.imageVisible) {
              return ["Inline image hidden by omp's image budget."];
            }
            if (cached.columns === view.size.columns && cached.rows === view.size.rows) {
              return cached.lines;
            }
            const lines = placeholderRows(image)(view.size.columns)(view.size.rows);
            rowsRef = { columns: view.size.columns, rows: view.size.rows, lines };
            return lines;
          })();
          const line = formatLine(surface.theme)(width);
          return [line(view.status), ...rows, line("? ask · " + view.footer)];
        };
      },
      handleInput: (key) => {
        if (matchesKey(key)("?")) {
          const $1 = player.shownMoment;
          return () => {
            const moment = $1();
            return traverse_3((selected) => {
              const $2 = player.dispose;
              const $3 = surface.done($Either("Right", $Maybe("Just", selected)));
              return () => {
                $2();
                return $3();
              };
            })(moment)();
          };
        }
        if (matchesKey(key)("q") || matchesKey(key)("escape") || matchesKey(key)("ctrl+c")) {
          return player.input(Close);
        }
        if (matchesKey(key)("space")) {
          return player.input(TogglePlayback);
        }
        if (matchesKey(key)("home")) {
          return player.input(Restart);
        }
        if (matchesKey(key)("left")) {
          return player.input(PreviousKeyframe);
        }
        if (matchesKey(key)("right")) {
          return player.input(NextKeyframe);
        }
        if (matchesKey(key)("[")) {
          return player.input($Input("Step", -1));
        }
        if (matchesKey(key)("]")) {
          return player.input($Input("Step", 1));
        }
        if (matchesKey(key)("up")) {
          return player.input(PreviousScene);
        }
        if (matchesKey(key)("down")) {
          return player.input(NextScene);
        }
        return () => {};
      },
      invalidate: () => {},
      dispose: player.dispose
    };
  };
};
var play = (root) => (context) => (options) => fromAff()(_bind(_liftEffect(interactive(context)))((interactive) => _bind((() => {
  const $0 = _throwError(error("Inline Markgraf playback requires omp's interactive terminal."));
  if (!interactive) {
    return $0;
  }
  if (interactive) {
    return _pure();
  }
  fail();
})())(() => _bind(_liftEffect(supportsImages))((supported) => _bind((() => {
  const $0 = _throwError(error("Inline Markgraf playback requires Kitty Unicode placeholders and local shared memory (Ghostty or Kitty)."));
  if (!supported) {
    return $0;
  }
  if (supported) {
    return _pure();
  }
  fail();
})())(() => _bind(_liftEffect(cwd(context)))((cwd) => _bind(resolve3(root)(cwd)(options))((request) => _bind(_bind(_liftEffect(mount(context)(createPlayer(request))))(toAff$p(coerce)))((result) => {
  if (result.tag === "Left") {
    return _throwError(error(result._1));
  }
  if (result.tag === "Right") {
    if (result._1.tag === "Nothing") {
      return _pure("Closed inline Markgraf playback: " + request.path);
    }
    if (result._1.tag === "Just") {
      const anchor = writeJSON3({ path: request.path, timeSeconds: result._1._1.time, frame: result._1._1.frame, fps: result._1._1.fps });
      return _bind(_liftEffect(pasteToEditor(context.ctx)(`

Markgraf moment (inspect this frame before answering):
` + anchor + `

`)))((inserted) => _bind((() => {
        const $0 = _throwError(error("omp's composer is unavailable. Selected Markgraf moment: " + anchor));
        if (!inserted) {
          return $0;
        }
        if (inserted) {
          return _pure();
        }
        fail();
      })())(() => _pure("Prepared a question draft for Markgraf moment " + anchor + ". No question has been submitted; wait for the user to send it.")));
    }
  }
  fail();
}))))))));
var register2 = (root) => (api) => register(api)({
  command: (context) => (requested) => play(root)(context)(commandOptions(requested)),
  tool: (context) => (options) => play(root)(context)({
    path: options.path,
    transparency: (() => {
      const $0 = nullable(options.background, Nothing, Just);
      if ($0.tag === "Nothing") {
        return false;
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })() ? PaintBackground : TransparentBackground
  })
});

// agents/omp.js
function markgraf(api) {
  register2(fileURLToPath(new URL("./", import.meta.url)))(api)();
}
export {
  markgraf as default
};
