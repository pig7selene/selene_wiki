## 埃氏筛

从小到大考虑每个数并且标记它的所有倍数，最后没有被标记的就是素数，要找到直到 $n$ 的所有素数只需要遍历到 $sqrt(n)$ 就可以了

```c++
vector<int> prime;
bool is_prime[N];

void Eratosthenes(int n) {
  is_prime[0] = is_prime[1] = false;
  for (int i = 2; i <= n; ++i) is_prime[i] = true;
  // i * i <= n 说明 i <= sqrt(n)
  for (int i = 2; i * i <= n; ++i) {
    if (is_prime[i])
      for (int j = i * i; j <= n; j += i) is_prime[j] = false;
  }
  for (int i = 2; i <= n; ++i)
    if (is_prime[i]) prime.push_back(i);
}
```

## 线性筛

这是埃氏筛的优化，埃氏筛会把一个合数重复标记

```c++
vector<int> pri;
bool not_prime[N];

void pre(int n) {
  for (int i = 2; i <= n; ++i) {
    if (!not_prime[i]) {
      pri.push_back(i);
    }
    for (int pri_j : pri) {
      if (i * pri_j > n) break;
      not_prime[i * pri_j] = true;
      if (i % pri_j == 0) {
        // i % pri_j == 0
        // 换言之，i 之前被 pri_j 筛过了
        // 由于 pri 里面质数是从小到大的，所以 i 乘上其他的质数的结果一定会被
        // pri_j 的倍数筛掉，就不需要在这里先筛一次，所以这里直接 break
        // 掉就好了
        break;
      }
    }
  }
}
```

## 快速幂

```cpp
long long binpow(long long a, long long b, long long p) {
  long long res = 1;
  while (b > 0) {
    if (b & 1) res = res * a % p;
    a = a * a % p;
    b >>= 1;
  }
  return res;
}
```

## 扩展欧几里得(exgcd)

问题：求 $ax + by = gcd(a,b)$ 的一组整数解

当 $b = 0$ 时，$ax + by = a$，故而 $x = 1, y = 0$

当 $b \ne 0$ 时，由欧几里得算法，

$$
gcd(a,b) = gcd(b,a \% b)
$$

由裴蜀定理，$gcd(a,b) = ax + by$

$$
\begin{aligned}
gcd(b,a \% b)
&= bx_1 + (a \% b)y_1 \\
&= bx_1 + \left(a - \left\lfloor \frac{a}{b} \right\rfloor \times b\right)y_1 \\
&= ay_1 + b\left(x_1 - \left\lfloor \frac{a}{b} \right\rfloor y_1\right)
\end{aligned}
$$

所以

$$
x = y_1,\qquad y = x_1 - \left\lfloor \frac{a}{b} \right\rfloor y_1
$$

可以用递归算法，先求出下一层的 $x_1, y_1$，再回代到上一层，层层回代，可求特解 $(x_0,y_0)$

**构造通解**


$$
\begin{cases}
x = x_0 + \dfrac{b}{gcd(a,b)} \times k \\[8pt]
y = y_0 - \dfrac{a}{gcd(a,b)} \times k
\end{cases}
$$



考虑 $ax + by = 0$ 构造。

```cpp
int exgcd(int a, int b, int &x, int &y) {
  int x1 = 1, x2 = 0, x3 = 0, x4 = 1;
  while (b != 0) {
    int c = a / b;
    std::tie(x1, x2, x3, x4, a, b) =
        std::make_tuple(x3, x4, x1 - x3 * c, x2 - x4 * c, b, a - b * c);
  }
  x = x1, y = x2;
  return a;
}
```

## 费马小定理

!!! info "费马小定理"

    1. 设 $p$ 是素数。对于任意整数 $a$ 且 $p \nmid a$，都有
    
        $$
        a^{p-1} \equiv 1 \pmod p
        $$
    
    2. 设 $p$ 是素数。对于任意整数 $a$，都有
    
        $$
        a^p \equiv a \pmod p
        $$

这两个同余关系在 $p \nmid a$ 时是等价的；而在 $p \mid a$ 时，$a^p \equiv 0 \equiv a \pmod p$ 平凡地成立。因此，这两个命题是等价的。这两个命题常常都称作费马小定理。

## 欧拉定理

欧拉定理将费马小定理推广到了一般模数的情况，但仍然要求底数与指数互素

!!! info "欧拉定理"

    对于整数 $m > 0$ 和整数 $a$，且 $gcd(a,m) = 1$，有 $a^{\varphi(m)} \equiv 1 \pmod m$，其中，$\varphi(\cdot)$ 为欧拉函数。

## 扩展欧拉定理

扩展欧拉定理进一步将结论推广到了底数与指数不互素的情况。由此，它彻底解决了任意模数下任意底数的幂次计算问题，将它们转化为指数小于 $2\varphi(m)$ 的情形，从而可以通过快速幂在 $O(\log \varphi(m))$ 时间内计算。

!!! info "扩展欧拉定理"

    对于任意正整数 $m$、整数 $a$ 和非负整数 $k$，有
    
    $$
    a^k \equiv
    \begin{cases}
    a^{k \bmod \varphi(m)}, & \gcd(a,m) = 1, \\
    a^k, & \gcd(a,m) \ne 1,\ k < \varphi(m), \\
    a^{(k \bmod \varphi(m)) + \varphi(m)}, & \gcd(a,m) \ne 1,\ k \ge \varphi(m).
    \end{cases}
    \pmod m
    $$

第二种情况是在说，如果 $k < \varphi(m)$，那么，就无需继续降幂，直接应用快速幂即可；而第三种和第一种情形的最大区别是，通过取余降幂之后，是否需要加上一项 $\varphi(m)$。当然，将第一种情形合并进入第二、三种情形也是正确的。

## 中国剩余定理(CRT)

求解线性同余方程组


$$
\begin{cases}
x \equiv r_1 \pmod {m_1} \\
x \equiv r_2 \pmod {m_2} \\
\vdots \\
x \equiv r_n \pmod {m_n}
\end{cases}
$$



其中模数 $m_1, m_2, \cdots, m_n$ 为**两两互质**的整数，求 $x$ 的最小非负整数解。

**中国剩余定理**

1.计算所有模数的积 $M$

2.计算第 $i$ 个方程的$c_i = \frac{M}{m_i}$

3.计算 $c_i$ 在模 $m_i$ 意义下的逆元 $c_i^{-1}$

4.$x = \sum_{i=1}^{n} r_i c_i c_i^{-1} \pmod M$

```cpp
LL CRT(int k, LL* a, LL* r) {
  LL n = 1, ans = 0;
  for (int i = 1; i <= k; i++) n = n * r[i];
  for (int i = 1; i <= k; i++) {
    LL m = n / r[i], b, y;
    exgcd(m, r[i], b, y);  // b * m mod r[i] = 1
    ans = (ans + a[i] * m * b % n) % n;
  }
  return (ans % n + n) % n;
}
```

## 扩展中国剩余定理(exCRT)

前两个方程：$x \equiv r_1 \pmod {m_1},\qquad x \equiv r_2 \pmod {m_2}$

转化为不定方程：$x = m_1p + r_1 = m_2q + r_2$

则 $m_1p - m_2q = r_2 - r_1$

由裴蜀定理，

当 $gcd(m_1,m_2) \nmid (r_2 - r_1)$ 时，无解

当 $gcd(m_1,m_2) \mid (r_2 - r_1)$ 时，有解

由扩欧算法，

得特解$p = p * \frac{r_2 - r_1}{gcd},\qquad q = q * \frac{r_2 - r_1}{gcd}$

其通解$P = p + \frac{m_2}{gcd} * k,\qquad Q = q - \frac{m_1}{gcd} * k$

所以$x = m_1P + r_1 = \frac{m_1m_2}{gcd} * k + m_1p + r_1$

前两个方程**等价合并**为一个方程 $x \equiv r \pmod m$，其中$r = m_1p + r_1, m = lcm(m_1,m_2)$

所以 $n$ 个同余方程只要合并 $n - 1$ 次，即可求解

```cpp
LL exgcd(LL a,LL b,LL &x,LL &y){
    if(!b){
        x = 1,y = 0;
        return a;
    }
    LL g = exgcd(b,a % b,y,x);
    y -= a / b * x;
    return g;
}

LL mod(LL x,LL p){
    return (x % p + p) % p;
}

LL exCRT(int k,LL *a,LL *r){
    LL ans = a[1], n = r[1];

    for(int i = 2;i <= k;i++){
        LL b, y;
        LL c = a[i] - ans;

        LL g = exgcd(n,r[i],b,y);

        if(c % g) return -1;

        LL t = r[i] / g;

        b = mod((i128)(c / g) * b % t,t);

        ans = ans + (i128)n * b;
        n = (i128)n / g * r[i];

        ans = mod(ans,n);
    }

    return ans;
}
```



## 卢卡斯定理

首先讨论模数为素数 $p$ 的情形

!!! info "卢卡斯定理"

    对于素数 $p$，有
    
    $$
    \binom{n}{k} \equiv 
    \binom{\lfloor n/p \rfloor}{\lfloor k/p \rfloor}
    \binom{n \bmod p}{k \bmod p}
    \pmod p.
    $$
    
    其中，当 $n < k$ 时，二项式系数 $\binom{n}{k}$ 规定为 $0$。

卢卡斯定理指出，模数为素数 $p$ 的时候，大组合数的计算可以转化为规模更小的组合数的计算。在右式中，第一个组合数可以继续递归，直到 $n,k < p$ 为止；第二个组合数可以直接计算，或者预处理出来

```cpp
long long Lucas(long long n, long long k, long long p) {
  if (k == 0) return 1;
  return (C(n % p, k % p, p) * Lucas(n / p, k / p, p)) % p;
}
```



## 整除分块

求   $\sum_{i=1}^{n} \left\lfloor \frac{n}{i} \right\rfloor$ 

**性质1：分块的块数 $\le 2\lfloor \sqrt n \rfloor$**

当 $i \le \lfloor \sqrt n \rfloor$ 时，$\left\lfloor \dfrac{n}{i} \right\rfloor$ 有 $\lfloor \sqrt n \rfloor$ 种取值。

当 $i > \lfloor \sqrt n \rfloor$ 时，$\left\lfloor \dfrac{n}{i} \right\rfloor \le \lfloor \sqrt n \rfloor$，$\left\lfloor \dfrac{n}{i} \right\rfloor$ 至多有 $\lfloor \sqrt n \rfloor$ 种取值。

**性质2：$i$ 所在块的右端点为 $\left\lfloor \dfrac{n}{\left\lfloor n/i \right\rfloor} \right\rfloor$**

$i$ 所在块的值 $k = \left\lfloor \dfrac{n}{i} \right\rfloor$，则 $k \le \dfrac{n}{i}$，则 $\left\lfloor \frac{n}{k} \right\rfloor
\ge
\left\lfloor \frac{n}{n/i} \right\rfloor
=
\lfloor i \rfloor
=
i$，所以 $i_{max}
=
\left\lfloor \frac{n}{k} \right\rfloor
=
\left\lfloor \frac{n}{\left\lfloor n/i \right\rfloor} \right\rfloor$，代码实现时，右端点

$r = n / (n / l)$;

```cpp
ll calc(ll n) {
    ll ans = 0;

    for(ll l = 1,r;l <= n;l = r + 1) {
        ll k = n / l;      // 当前块的值 floor(n / i)
        r = n / k;         // 当前块的右端点

        ans += (r - l + 1) * k;
    }

    return ans;
}
```



## 狄利克雷卷积

数列 $\langle a_1,a_2,a_3,\cdots\rangle$ 的**狄利克雷生成函数**

$$
F(x)=\frac{a_1}{1^x}+\frac{a_2}{2^x}+\frac{a_3}{3^x}+\cdots
=\sum_{n=1}^{\infty}\frac{a_n}{n^x}
$$

**乘法运算**


$$
\begin{aligned}
&\sum_{i=1}^{\infty}\frac{a_i}{i^x}
\sum_{j=1}^{\infty}\frac{b_j}{j^x}
\\[8pt]
=&
\left(
\frac{a_1}{1^x}
+\frac{a_2}{2^x}
+\frac{a_3}{3^x}
+\frac{a_4}{4^x}
+\cdots
\right)
\left(
\frac{b_1}{1^x}
+\frac{b_2}{2^x}
+\frac{b_3}{3^x}
+\frac{b_4}{4^x}
+\cdots
\right)
\\[8pt]
=&
\frac{a_1b_1}{1^x}
+
\frac{a_1b_2+a_2b_1}{2^x}
+
\frac{a_1b_3+a_3b_1}{3^x}
+
\frac{a_1b_4+a_2b_2+a_4b_1}{4^x}
+\cdots
\\[8pt]
=&
\sum_{n=1}^{\infty}
\frac{1}{n^x}
{\sum_{d\mid n}a_db_{\frac{n}{d}}}
\end{aligned}
$$


**欧拉函数**

定义


$$
\varphi(n)=\sum_{i=1}^{n}[\gcd(i,n)=1]
$$



性质


$$
\sum_{d\mid n}\varphi(d)=n
$$



**莫比乌斯函数**

定义


$$
\mu(n)=
\begin{cases}
1, & n=1 \\
(-1)^s, & n=p_1p_2\cdots p_s \\
0, & n\text{ 包含相同质因子}
\end{cases}
$$



性质


$$
\sum_{d\mid n}\mu(d)=[n=1]
$$



联系


$$
{\sum_{d\mid n}\mu(d)\frac{n}{d}=\varphi(n)}
$$


**狄利克雷卷积**

定义

$f(n), g(n)$ 是两个积性函数，


$$
(f * g)(n)
=
\sum_{d\mid n} f(d)g\left(\frac{n}{d}\right)
=
\sum_{d\mid n} f\left(\frac{n}{d}\right)g(d)
$$



规律

1. 交换律：$f * g = g * f$

2. 结合律：$(f * g) * h = f * (g * h)$

3. 分配律：$(f + g) * h = f * h + g * h$

三个常用函数

1. 元函数 $\varepsilon(n)=[n=1]$

2. 常数函数 $1(n)=1$

3. 恒等函数 $id(n)=n$

常用卷积关系

1.$\sum_{d\mid n}\mu(d)=[n=1]
\Longleftrightarrow
\mu * 1 = \varepsilon$

2.$\sum_{d\mid n}\varphi(d)=n
\Longleftrightarrow
\varphi * 1 = id$

3.$\sum_{d\mid n}\mu(d)\frac{n}{d}=\varphi(n)
\Longleftrightarrow
\mu * id = \varphi\sum_{d\mid n}\mu(d)\frac{n}{d}=\varphi(n)
\Longleftrightarrow
\mu * id = \varphi$

4.$\sum_{d\mid n}\mu(d)\frac{n}{d}=\varphi(n)
\Longleftrightarrow
\mu * id = \varphi\sum_{d\mid n}\mu(d)\frac{n}{d}=\varphi(n)
\Longleftrightarrow
\mu * id = \varphi$

5.$f * 1 \ne f=
\sum_{d\mid n}f(d)$



## 莫比乌斯反演

$$
{
f(n)=\sum_{d\mid n}g(d)
\Longleftrightarrow
g(n)=\sum_{d\mid n}\mu(d)f\left(\frac{n}{d}\right)
}
$$

$f(n),g(n)$ 均为积性函数，  
$f(n)$ 称为 $g(n)$ 的莫比乌斯变换，  
$g(n)$ 称为 $f(n)$ 的莫比乌斯逆变换。

**方法一**

若 $f=g*1$，则


$$
\mu*f=\mu*g*1=g*\mu*1=g*\varepsilon=g
$$



若 $g=\mu*f$，则


$$
g*1=\mu*f*1=f*\mu*1=f*\varepsilon=f
$$



**方法二**


$$
\begin{aligned}
\sum_{d\mid n}\mu(d)f\left(\frac{n}{d}\right)
&=
\sum_{d\mid n}\mu(d)
\sum_{k\mid \frac{n}{d}}g(k)
\\[8pt]
&=
\sum_{d\mid n}
\sum_{k\mid \frac{n}{d}}
\mu(d)g(k)
=
\sum_{k\mid n}
\sum_{d\mid \frac{n}{k}}
\mu(d)g(k)
\\[8pt]
&=
\sum_{k\mid n}g(k)
\sum_{d\mid \frac{n}{k}}\mu(d)
=
g(n)
\end{aligned}
$$
