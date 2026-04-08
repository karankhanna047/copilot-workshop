// This file simulates "legacy code" that a developer inherited.
// Nobody on the team wrote this. Nobody knows exactly what it does.
// The original developer left the company 2 years ago.
// Your job: use Copilot to understand it, then refactor it.

function pr(d, o) {
  var r = [];
  var t = {};
  for (var i = 0; i < d.length; i++) {
    var x = d[i];
    if (o.gp) {
      var k = x[o.gp];
      if (!t[k]) t[k] = { k: k, items: [], s: 0, c: 0 };
      t[k].items.push(x);
      if (o.sf) t[k].s += (x[o.sf] || 0);
      t[k].c++;
    }
  }
  if (o.gp) {
    var keys = Object.keys(t);
    for (var j = 0; j < keys.length; j++) {
      var g = t[keys[j]];
      var row = { group: g.k, count: g.c };
      if (o.sf) row.total = g.s;
      if (o.avg && o.sf) row.average = g.c > 0 ? g.s / g.c : 0;
      if (o.flt) {
        if (o.flt.min !== undefined && row.total < o.flt.min) continue;
        if (o.flt.max !== undefined && row.total > o.flt.max) continue;
      }
      r.push(row);
    }
  } else {
    for (var m = 0; m < d.length; m++) {
      var item = {};
      if (o.cols) {
        for (var n = 0; n < o.cols.length; n++) {
          item[o.cols[n]] = d[m][o.cols[n]];
        }
      } else {
        item = Object.assign({}, d[m]);
      }
      r.push(item);
    }
  }
  if (o.srt) {
    r.sort(function(a, b) {
      var v1 = a[o.srt.f], v2 = b[o.srt.f];
      if (o.srt.d === 'desc') return v1 > v2 ? -1 : v1 < v2 ? 1 : 0;
      return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
    });
  }
  if (o.lmt) r = r.slice(0, o.lmt);
  return { data: r, meta: { total: r.length, generated: new Date().toISOString() } };
}

function fmt(v, t) {
  if (t === 'currency') return '$' + (typeof v === 'number' ? v.toFixed(2) : '0.00');
  if (t === 'pct') return (typeof v === 'number' ? (v * 100).toFixed(1) : '0.0') + '%';
  if (t === 'date') {
    var d = new Date(v);
    return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
  }
  return String(v);
}

function rnk(d, f, ord) {
  var s = d.slice().sort(function(a, b) {
    return ord === 'asc' ? a[f] - b[f] : b[f] - a[f];
  });
  for (var i = 0; i < s.length; i++) {
    s[i]._rank = i + 1;
    if (i > 0 && s[i][f] === s[i-1][f]) s[i]._rank = s[i-1]._rank;
  }
  return s;
}

function agg(d, ops) {
  var result = {};
  for (var i = 0; i < ops.length; i++) {
    var op = ops[i];
    var vals = d.map(function(x) { return x[op.f]; }).filter(function(v) { return v !== null && v !== undefined; });
    if (op.t === 'sum') result[op.as || op.f + '_sum'] = vals.reduce(function(a, b) { return a + b; }, 0);
    if (op.t === 'avg') result[op.as || op.f + '_avg'] = vals.length > 0 ? vals.reduce(function(a, b) { return a + b; }, 0) / vals.length : 0;
    if (op.t === 'min') result[op.as || op.f + '_min'] = Math.min.apply(null, vals);
    if (op.t === 'max') result[op.as || op.f + '_max'] = Math.max.apply(null, vals);
    if (op.t === 'count') result[op.as || op.f + '_count'] = vals.length;
    if (op.t === 'distinct') result[op.as || op.f + '_distinct'] = vals.filter(function(v, i, a) { return a.indexOf(v) === i; }).length;
  }
  return result;
}

module.exports = { processReport: pr, formatValue: fmt, rankData: rnk, aggregate: agg };
