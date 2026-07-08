## 最小表示法

当字符串 $S$ 中选定一个位置 $i$ 满足 $S[i\sim n]+S[1\sim i-1]=T$，则 $T$ 是 $S$ 的**循环同构串**。

设 $S=$ “bcad”，其循环同构串有 “bcad”、 “cadb”、 “adbc”、 “dbca”，  
当 $i=3$ 时，得到字典序最小的循环同构串是 “adbc”。

**最小表示法**就是找出字符串 $S$ 的循环同构串中**字典序最小**的那一个。

```cpp
int n;
char s[N];

int get_min(char *s){
    n = strlen(s + 1);
    for(int i = 1;i <= n;i++) s[n + i] = s[i];

    int i = 1, j = 2, k = 0;
    while(i <= n && j <= n){
        for(k = 0; k < n && s[i + k] == s[j + k]; k++);
        s[i + k] > s[j + k] ? i = i + k + 1 : j = j + k + 1;
        if(i == j) j++;
    }

    return min(i, j);
}
```



## KMP算法

**next函数**

$\text{next}[i]$ 表示模式串 $P[1,i]$ 中相等前后缀的最长长度。

```cpp
ne[1] = 0;
for(int i = 2, j = 0; i <= n; i ++){
    while(j && P[i] != P[j + 1]) j = ne[j];
    if(P[i] == P[j + 1]) j ++;
    ne[i] = j;
}
```

**模式串与主串匹配**

```cpp
for(int i = 1, j = 0; i <= m; i ++){
    while(j && S[i] != P[j + 1]) j = ne[j];
    if(S[i] == P[j + 1]) j ++;
    if(j == n) printf("%d\n", i - n + 1);
}
```

## Manacher 算法

Manacher 算法可以在 $O(n)$ 的时间内求出一个字符串中的**最长回文串**。

改造字符串

在字符之间和字符串两端插入 `#`，使得奇回文串和偶回文串都变成**奇回文串**，方便统一处理。

其中 `s[0] = '$'` 是哨兵，用来防止越界。

```cpp
string change(string a){
    string s = "$#";
    for(auto c : a){
        s += c;
        s += '#';
    }
    return s;
}
```

回文半径

```cpp
vector<int> manacher(string a){
    string s = "$#";
    for(auto c : a){
        s += c;
        s += '#';
    }

    int n = s.size() - 1;
    vector<int> d(n + 1);

    d[1] = 1;
    for(int i = 2,l = 1,r = 1;i <= n;i++){
        if(i <= r) d[i] = min(d[r - i + l],r - i + 1);
        while(s[i - d[i]] == s[i + d[i]]) d[i]++;
        if(i + d[i] - 1 > r){
            l = i - d[i] + 1;
            r = i + d[i] - 1;
        }
    }

    return d;
}
```

求最长回文串长度

```cpp
void solve() {
    string a;cin >> a;

    auto d = manacher(a);

    int ans = 0;
    for(auto x : d){
        ans = max(ans,x - 1);
    }

    cout << ans << '\n';
}
```



## 扩展KMP(Z函数)

**Z 函数**

$z[i]$ 表示：

$$
z[i]=LCP(s,s[i...n])
$$

也就是原串 $s$ 和从 $i$ 开始的后缀，最长公共前缀长度。

```cpp
vector<int> get_z(string s){
    int n = s.size() - 1;
    vector<int> z(n + 1);

    z[1] = n;
    for(int i = 2,l = 0,r = 0;i <= n;i++){
        if(i <= r) z[i] = min(z[i - l + 1],r - i + 1);

        while(i + z[i] <= n && s[1 + z[i]] == s[i + z[i]]){
            z[i]++;
        }

        if(i + z[i] - 1 > r){
            l = i;
            r = i + z[i] - 1;
        }
    }

    return z;
}
```

**扩展 KMP**

$p[i]$ 表示：

$$
p[i]=LCP(s,t[i...m])
$$

也就是模式串 $s$ 和文本串 $t$ 从 $i$ 开始的后缀，最长公共前缀长度。

```cpp
vector<int> get_p(string s,string t,vector<int> &z){
    int n = s.size() - 1;
    int m = t.size() - 1;

    vector<int> p(m + 1);

    for(int i = 1,l = 0,r = 0;i <= m;i++){
        if(i <= r) p[i] = min(z[i - l + 1],r - i + 1);

        while(1 + p[i] <= n && i + p[i] <= m && s[1 + p[i]] == t[i + p[i]]){
            p[i]++;
        }

        if(i + p[i] - 1 > r){
            l = i;
            r = i + p[i] - 1;
        }
    }

    return p;
}
```

## Trie 字典树

Trie 用来维护字符串集合，支持：

1. 插入字符串
2. 查询字符串出现次数

适用于只包含小写字母 `a ~ z` 的字符串。

```cpp
ch[p][c] // 节点 p 走字符 c 到达的儿子节点
cnt[p]   // 以节点 p 结尾的字符串出现次数
idx      // 当前节点编号
```

```cpp
const int N = 2e6 + 5;

int ch[N][26], cnt[N], idx;

void insert(string s){
    int p = 0;
    for(auto c : s){
        int x = c - 'a';
        if(!ch[p][x]) ch[p][x] = ++idx;
        p = ch[p][x];
    }
    cnt[p]++;
}

int query(string s){
    int p = 0;
    for(auto c : s){
        int x = c - 'a';
        if(!ch[p][x]) return 0;
        p = ch[p][x];
    }
    return cnt[p];
}
```



## AC自动机

