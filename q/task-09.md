# 任务 09

> 参赛包：`pkg-08e82c8d`  
> 范围：M081–M090，共 10 题

## M081-S011

**自然语言输入：** 找 Grafana 资产：响应头哈希、正文哈希、网站图标哈希、fid 指纹这四项中，至少两项有值。

**查询语句：** `待填写`

## M082-S001

**自然语言输入：** 搜索以下主域资产，都是或的关系，不管这条资产是绑定的任意主域还是他的证书里面有任意主域都算。但是证书要满足被fofa标记为匹配并且有效，最后证书过期时间晚于 2024-01-01 00:00:00 且早于2026-08-30 18:17:49：

```text
kuaihuoyun.com
wlhyos.cn
wlhyos.com
56ctms.com
xiaokuaikeji.com
zhihuiwuliu.org.cn
```

**查询语句：** `待填写`

## M083-S008

**自然语言输入：** 请把下面的 Shodan 查询转换成 FOFA：

```text
"Server: nginx" http.title:"Welcome"
```

**查询语句：** `待填写`

## M084-S004

**自然语言输入：** 把这条 Google Dork 转换为 FOFA：

```text
intitle:"Grafana" intext:"JavaScript"
```

**查询语句：** `待填写`

## M085-S001

**自然语言输入：** 把这个 urlscan.io 搜索意图转换成 FOFA：HTML 包含 login，并且域名包含 bet、casino 或 kasino。

**查询语句：** `待填写`

## M086-S006

**自然语言输入：** 把这条 Hunter 查询转成 FOFA：

```text
domain="google"&&domain.suffix!="google.com"&&web.title=""
```

**查询语句：** `待填写`

## M087-S009

**自然语言输入：** 将这条 Censys 搜索转换为 FOFA：

```text
host.services.endpoints.http.headers: (key: "server" and value: "Tengine") or host.services.endpoints.http.headers: (key: "x-cache" and value: "MISS")
```

**查询语句：** `待填写`

## M088-S004

**自然语言输入：** 修正这条 FOFA 查询，意图是搜索香港地区、Server 精确为 Apache，并排除 ASN 4134：

```text
asn!=”4134″ && region=”HK” && server==”Apache”
```

**查询语句：** `待填写`

## M089-S010

**自然语言输入：** 修正这条 FOFA 查询。意图：HFS 的 80 端口都要；8080 端口仅状态码为 200 时要。原查询：

```text
app="HFS" && port="80" |｜ app="HFS” && port="8080" && status_code="200"
```

**查询语句：** `待填写`

## M090-S008

**自然语言输入：** 依据下面的响应片段生成搜索语句。Etag、Content-Length 保留材料中的值，其余响应头只要求字段名存在。本题不限定状态码。

```http
HTTP/2.0 200 OK
Content-Length: 1171
Accept-Ranges: bytes
Cache-Control: max-age=900
Cache-Control: public, max-age=900, stale-while-revalidate=60
Content-Type: text/html; charset=utf-8
Date: Mon, 14 Sep 2026 07:38:38 GMT
Etag: "6aa522a3-493"
Last-Modified: Sat, 12 Sep 2026 10:00:03 GMT
Server: nginx
Vary: Accept-Encoding
```

**查询语句：** `待填写`
