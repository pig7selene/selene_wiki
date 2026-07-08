## 组合数

```cpp
vector<ll> fac(N), ifac(N);

ll qpow(ll a,ll b){
    ll res = 1;
    while(b){
        if(b & 1) res = res * a % P;
        a = a * a % P;
        b >>= 1;
    }
    return res;
}

void init(){
    fac[0] = 1;
    for(int i = 1;i < N;i++){
        fac[i] = fac[i - 1] * i % P;
    }

    ifac[N - 1] = qpow(fac[N - 1],P - 2);
    for(int i = N - 2;i >= 0;i--){
        ifac[i] = ifac[i + 1] * (i + 1) % P;
    }
}

ll C(int n,int m){
    if(m < 0 || m > n) return 0;
    return fac[n] * ifac[m] % P * ifac[n - m] % P;
}
```



## 卢卡斯定理

参考**数论专题-卢卡斯定理**



