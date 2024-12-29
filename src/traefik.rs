use std::collections::BTreeMap;
use std::collections::HashMap;
use rocket::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TraefikConfig {
    pub http: HttpConfig,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tls: Option<TlsConfig>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tcp: Option<TcpConfig>,
}

impl TraefikConfig {
    pub fn new() -> Self {
        Self {
            http: HttpConfig::new(),
            tls: None,
            tcp: None,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct HttpConfig {
    #[serde(skip_serializing_if = "BTreeMap::is_empty")]
    pub routers: BTreeMap<String, HttpRouter>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty")]
    pub services: BTreeMap<String, HttpService>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty")]
    pub middlewares: BTreeMap<String, HttpMiddleware>,
}

impl HttpConfig {
    pub fn new() -> Self {
        Self {
            routers: BTreeMap::new(),
            services: BTreeMap::new(),
            middlewares: BTreeMap::new(),
        }
    }

    pub fn merge(&mut self, other: HttpConfig) {
        self.routers.extend(other.routers);
        self.services.extend(other.services);
        self.middlewares.extend(other.middlewares);
    }

    pub fn add_default_middlewares(&mut self) {
        self.middlewares.insert(
            "https-redirect".into(),
            HttpMiddleware {
                redirect_scheme: Some(HttpRedirectScheme {
                    scheme: HttpScheme::Https,
                }),
            },
        );
    }

    pub fn is_empty(&self) -> bool {
        self.routers.is_empty() && self.services.is_empty() && self.middlewares.is_empty()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct HttpRouter {
    pub rule: String,
    pub service: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub priority: Option<i32>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub middlewares: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct HttpService {
    #[serde(rename = "loadBalancer")]
    pub load_balancer: HttpLoadBalancer,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct HttpLoadBalancer {
    pub servers: Vec<HttpServer>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct HttpServer {
    pub url: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct HttpMiddleware {
    #[serde(rename = "redirectScheme")]
    redirect_scheme: Option<HttpRedirectScheme>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct HttpRedirectScheme {
    scheme: HttpScheme,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub enum HttpScheme {
    #[serde(rename = "http")]
    _Http,
    #[serde(rename = "https")]
    Https,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TcpConfig {
    #[serde(skip_serializing_if = "BTreeMap::is_empty")]
    pub routers: BTreeMap<String, TcpRouter>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty")]
    pub services: BTreeMap<String, TcpService>,
}

impl TcpConfig {
    pub fn new() -> Self {
        Self {
            routers: BTreeMap::new(),
            services: BTreeMap::new(),
        }
    }

    pub fn is_empty(&self) -> bool {
        self.routers.is_empty() && self.services.is_empty()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TcpRouter {
    pub rule: String,
    pub service: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub priority: Option<i32>,
    pub tls: Option<TcpTls>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TcpTls {
    pub passthrough: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TcpService {
    #[serde(rename = "loadBalancer")]
    pub load_balancer: TcpLoadBalancer,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TcpLoadBalancer {
    pub servers: Vec<TcpServer>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TcpServer {
    pub address: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TlsConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub certificates: Option<Vec<TlsCertificate>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub options: Option<HashMap<String, TlsOptions>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stores: Option<HashMap<String, TlsStore>>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TlsCertificate {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cert_file: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub key_file: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TlsOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cipher_suites: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct TlsStore {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub default_certificate: Option<TlsCertificate>,
}
