use std::net::TcpListener;

/// Check if a port is available
pub fn is_port_available(port: u16) -> bool {
    TcpListener::bind(("127.0.0.1", port)).is_ok()
}

/// Find an available port starting from the given port
pub fn find_available_port(start: u16, max_attempts: u16) -> Option<u16> {
    for port in start..=start.saturating_add(max_attempts) {
        if is_port_available(port) {
            return Some(port);
        }
    }
    None
}
