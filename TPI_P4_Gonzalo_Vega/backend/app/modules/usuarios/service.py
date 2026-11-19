from typing import List
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

class UsuarioNoEncontrado(Exception):
    def __init__(self, user_id: int):
        self.user_id = user_id
        super().__init__(f"Usuario con id {user_id} no encontrado")

class UsuarioDuplicado(Exception):
    def __init__(self, detalle: str):
        self.detalle = detalle
        super().__init__(detalle)

class OperacionInvalidaUsuario(Exception):
    def __init__(self, detalle: str):
        self.detalle = detalle
        super().__init__(detalle)

class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def listar_usuarios(self) -> List[UserPublic]:
        with self.uow as uow:
            usuarios = uow.usuarios.get_all(skip=0, limit=1000)
            return [UserPublic.model_validate(u) for u in usuarios]

    def activar_usuario(self, user_id: int) -> UserPublic:
        with self.uow as uow:
            user = uow.usuarios.get_by_id(user_id)
            if user is None:
                raise UsuarioNoEncontrado(user_id)
            user.disabled = False
            return UserPublic.model_validate(user)

    def desactivar_usuario(self, user_id: int, current_admin_id: int) -> UserPublic:
        if user_id == current_admin_id:
            raise OperacionInvalidaUsuario("El administrador no puede desactivarse a sí mismo")
        with self.uow as uow:
            user = uow.usuarios.get_by_id(user_id)
            if user is None:
                raise UsuarioNoEncontrado(user_id)
            user.disabled = True
            return UserPublic.model_validate(user)

