from core.security import hash_password, verify_password

# Prueba de hash y verificación
password = "mi_contraseña_segura"
hashed = hash_password(password)

print(f"Contraseña original: {password}")
print(f"Hash de la contraseña: {hashed}")

# Verificar si la contraseña coincide con el hash
if verify_password(password, hashed):
    print("La contraseña coincide con el hash.")
else:
    print("La contraseña no coincide con el hash.")
