use keyring::Entry;

const SERVICE_NAME: &str = "cloudplay";

/// Store token in OS secure storage
pub fn store_token(hostname: &str, token: &str) -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, &format!("token_{}", hostname))
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    entry.set_password(token)
        .map_err(|e| format!("Failed to store token: {}", e))?;
    Ok(())
}

/// Retrieve token from secure storage
pub fn get_token(hostname: &str) -> Result<String, String> {
    let entry = Entry::new(SERVICE_NAME, &format!("token_{}", hostname))
        .map_err(|e| format!("Failed to open keyring entry: {}", e))?;
    entry.get_password()
        .map_err(|e| format!("Failed to retrieve token: {}", e))
}

/// Delete token from secure storage
pub fn delete_token(hostname: &str) -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, &format!("token_{}", hostname))
        .map_err(|e| format!("Failed to open keyring entry: {}", e))?;
    entry.delete_credential()
        .map_err(|e| format!("Failed to delete token: {}", e))?;
    Ok(())
}
