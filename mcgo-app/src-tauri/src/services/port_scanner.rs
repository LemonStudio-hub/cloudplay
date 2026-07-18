use std::net::TcpListener;

/// Check if a port is available by attempting to bind to it.
/// Note: there is an inherent TOCTOU race — the port could be taken between
/// this check and the actual bind. This is a best-effort check.
pub fn is_port_available(port: u16) -> bool {
    let available = TcpListener::bind(("127.0.0.1", port)).is_ok();
    log::debug!("Port {} check: {}", port, if available { "available" } else { "in use" });
    available
}

/// Find an available port starting from the given port
#[allow(dead_code)]
pub fn find_available_port(start: u16, max_attempts: u16) -> Option<u16> {
    for port in start..=start.saturating_add(max_attempts) {
        if is_port_available(port) {
            return Some(port);
        }
    }
    None
}
