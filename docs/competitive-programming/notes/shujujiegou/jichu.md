## 常用 STL

**vector**

动态数组，支持随机访问，最常用。

```cpp
vector<int> a;

a.push_back(x);      // 尾部插入
a.pop_back();        // 删除尾部
a.back();            // 最后一个元素
a.size();            // 元素个数
a.empty();           // 是否为空
a.clear();           // 清空

a[i];                // 随机访问

sort(a.begin(),a.end());

a.erase(unique(a.begin(),a.end()),a.end());
```

**string**

字符串，本质上可以当成字符数组用。

```cpp
string s;
cin >> s;

s.size();            // 长度
s[i];                // 第 i 个字符，0 下标
s += 'a';            // 追加字符
s += "abc";          // 追加字符串

s.substr(pos,len);   // 从 pos 开始，取 len 个字符
s.find(t);           // 查找子串 t，找不到返回 string::npos
reverse(s.begin(),s.end());
```

**stack**

栈，后进先出。

```cpp
stack<int> stk;

stk.push(x);
stk.pop();
stk.top();
stk.empty();
stk.size();
```

常见用途：括号匹配、单调栈、DFS 模拟。

**queue**

队列，先进先出。

```cpp
queue<int> q;

q.push(x);
q.pop();
q.front();
q.back();
q.empty();
q.size();
```

常见用途：BFS。

**deque**

双端队列，两边都能插入删除。

```cpp
deque<int> q;

q.push_back(x);
q.push_front(x);

q.pop_back();
q.pop_front();

q.front();
q.back();
q.size();
q.empty();
```

常见用途：单调队列、滑动窗口。

**priority_queue**

优先队列，默认是大根堆。

```cpp
priority_queue<int> q;

q.push(x);
q.pop();
q.top();
q.empty();
q.size();
```

小根堆：

```cpp
priority_queue<int,vector<int>,greater<int>> q;
```

**set**

有序集合，自动排序，元素不重复。

```cpp
set<int> s;

s.insert(x);
s.erase(x);
s.count(x);          // 是否存在
s.size();
s.empty();
```

查找：

```cpp
auto it = s.find(x);

if(it != s.end()){
    // 找到了
}
```

二分：

```cpp
auto it = s.lower_bound(x); // 第一个 >= x
auto it = s.upper_bound(x); // 第一个 > x
```

取最小值和最大值：

```cpp
int mn = *s.begin();
int mx = *s.rbegin();
```

**multiset**

有序集合，允许重复元素。

```cpp
multiset<int> s;

s.insert(x);
```

删除一个 `x`：

```cpp
auto it = s.find(x);
if(it != s.end()) s.erase(it);
```

删除所有 `x`：

```cpp
s.erase(x);
```

**map**

有序映射，键值对，按键自动排序。

```cpp
map<int,int> mp;

mp[x]++;             // 统计次数
mp[x] = y;           // 赋值
mp.count(x);         // 判断 x 是否存在
mp.erase(x);
```

遍历：

```cpp
for(auto [x,y] : mp){
    cout << x << ' ' << y << '\n';
}
```

查找：

```cpp
auto it = mp.find(x);

if(it != mp.end()){
    cout << it->second << '\n';
}
```

**unordered_map**

哈希表，平均 $O(1)$，不排序。

```cpp
unordered_map<int,int> mp;

mp[x]++;
mp.count(x);
mp.erase(x);
```

如果不需要有序，一般比 `map` 快。

**unordered_set**

哈希集合，平均 $O(1)$，不排序。

```cpp
unordered_set<int> s;

s.insert(x);
s.count(x);
s.erase(x);
```

**bitset**

定长二进制集合，支持快速位运算。

```cpp
bitset<1005> b;

b.set(i);            // 第 i 位设为 1
b.reset(i);          // 第 i 位设为 0
b.flip(i);           // 第 i 位取反
b.count();           // 1 的个数
b.any();             // 是否存在 1
b.none();            // 是否全为 0
```

常见用途：优化集合 DP、传递闭包、可达性。


|       STL        |    插入     |    删除     |    查询     | 是否有序 |
| :--------------: | :---------: | :---------: | :---------: | :------: |
|     `vector`     | 尾部 $O(1)$ | 尾部 $O(1)$ | 下标 $O(1)$ |    否    |
|     `stack`      |   $O(1)$    |   $O(1)$    | 栈顶 $O(1)$ |    否    |
|     `queue`      |   $O(1)$    |   $O(1)$    | 队首 $O(1)$ |    否    |
|     `deque`      | 两端 $O(1)$ | 两端 $O(1)$ | 下标 $O(1)$ |    否    |
| `priority_queue` | $O(\log n)$ | $O(\log n)$ | 堆顶 $O(1)$ |   堆序   |
|      `set`       | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ |    是    |
|    `multiset`    | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ |    是    |
|      `map`       | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ |    是    |
| `unordered_set`  | 平均 $O(1)$ | 平均 $O(1)$ | 平均 $O(1)$ |    否    |
| `unordered_map`  | 平均 $O(1)$ | 平均 $O(1)$ | 平均 $O(1)$ |    否    |



## 并查集

```cpp
struct DSU {
    vector<int> p,sz;

    DSU(int n = 0) {
        init(n);
    }

    void init(int n) {
        p.resize(n + 1);
        sz.assign(n + 1,1);
        iota(p.begin(),p.end(),0);
    }

    int find(int x) {
        return p[x] == x ? x : p[x] = find(p[x]);
    }

    bool same(int x,int y) {
        return find(x) == find(y);
    }

    bool merge(int x,int y) {
        x = find(x),y = find(y);
        if(x == y) return false;
        if(sz[x] < sz[y]) swap(x,y);
        p[y] = x;
        sz[x] += sz[y];
        return true;
    }
};
```

## 莫队

用于**离线区间询问**。

适用条件：当前区间 $[l,r]$ 的答案可以通过加入 / 删除一个位置快速维护。

复杂度：

$$
O((n+q)\sqrt n)
$$

把所有询问按：

1. 左端点所在块
2. 右端点

排序，然后用双指针维护当前区间。

```cpp
struct Q{
    int l,r,id;
};

void solve() {
    int n,m;
    cin >> n >> m;

    vector<int> a(n + 1);
    for(int i = 1;i <= n;i++){
        cin >> a[i];
    }

    int B = sqrt(n);

    vector<Q> q(m + 1);
    for(int i = 1;i <= m;i++){
        cin >> q[i].l >> q[i].r;
        q[i].id = i;
    }

    sort(q.begin() + 1,q.end(),[&](Q x,Q y){
        if(x.l / B != y.l / B) return x.l < y.l;
        return x.r < y.r;
    });

    vector<ll> ans(m + 1);
    ll res = 0;

    auto add = [&](int p){
        // 加入位置 p
    };

    auto del = [&](int p){
        // 删除位置 p
    };

    int l = 1,r = 0;

    for(int i = 1;i <= m;i++){
        while(l > q[i].l) add(--l);
        while(r < q[i].r) add(++r);
        while(l < q[i].l) del(l++);
        while(r > q[i].r) del(r--);

        ans[q[i].id] = res;
    }

    for(int i = 1;i <= m;i++){
        cout << ans[i] << '\n';
    }
}
```

## ST 表

ST 表主要用于**静态区间查询**。

常见用途：

```cpp
区间最大值
区间最小值
区间 gcd
```

$f[i][j]$ 表示：从 $i$ 开始，长度为 $2^j$ 的区间答案

比如最大值：

$$
f[i][j]=\max(f[i][j-1],f[i+2^{j-1}][j-1])
$$

查询区间 $[l,r]$ 时，令：$k=\log_2(r-l+1)$

用两个长度为 $2^k$ 的区间覆盖：$[l,l+2^k-1]$和$[r-2^k+1,r]$

所以：

$$
ans=\max(f[l][k],f[r-2^k+1][k])
$$

```cpp
struct ST{
    int n;
    vector<int> lg;
    vector<vector<int>> f;

    ST(vector<int> &a){
        n = a.size() - 1;

        lg.assign(n + 1,0);
        for(int i = 2;i <= n;i++){
            lg[i] = lg[i / 2] + 1;
        }

        int K = lg[n] + 1;
        f.assign(n + 1,vector<int>(K));

        for(int i = 1;i <= n;i++){
            f[i][0] = a[i];
        }

        for(int j = 1;j < K;j++){
            for(int i = 1;i + (1 << j) - 1 <= n;i++){
                f[i][j] = max(f[i][j - 1],f[i + (1 << (j - 1))][j - 1]);
            }
        }
    }

    int query(int l,int r){
        int k = lg[r - l + 1];
        return max(f[l][k],f[r - (1 << k) + 1][k]);
    }
};
```

