from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


ESTADOS_VALIDOS = {"PENDIENTE", "CONFIRMADO", "ENTREGADO", "CANCELADO"}


class DetallePedidoCreate(BaseModel):
    producto_id: int = Field(..., gt=0, description="ID del producto existente")
    cantidad: int = Field(..., ge=1, description="Cantidad solicitada, al menos 1")


class DetallePedidoRead(BaseModel):
    pedido_id: int
    producto_id: int
    cantidad: int
    precio_unitario: float

    model_config = ConfigDict(from_attributes=True)


class PedidoCreate(BaseModel):
    detalles: List[DetallePedidoCreate] = Field(
        ...,
        min_length=1,
        description="Lista de detalles del pedido. Debe contener al menos un elemento.",
    )

    @field_validator("detalles")
    @classmethod
    def validar_detalles_sin_productos_duplicados(
        cls, value: List[DetallePedidoCreate]
    ) -> List[DetallePedidoCreate]:
        if not value:
            raise ValueError("El pedido debe contener al menos un detalle.")

        productos_vistos = set()
        for item in value:
            if item.producto_id in productos_vistos:
                raise ValueError(
                    f"El producto con ID {item.producto_id} se encuentra duplicado en los detalles del pedido."
                )
            productos_vistos.add(item.producto_id)
        return value


class PedidoUpdateEstado(BaseModel):
    estado: str = Field(
        ...,
        description="Nuevo estado del pedido: PENDIENTE, CONFIRMADO, ENTREGADO o CANCELADO",
    )

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, value: str) -> str:
        estado_normalizado = value.strip().upper()
        if estado_normalizado not in ESTADOS_VALIDOS:
            raise ValueError(
                f"Estado '{value}' inválido. Debe ser uno de: {', '.join(sorted(ESTADOS_VALIDOS))}."
            )
        return estado_normalizado


class PedidoRead(BaseModel):
    id: int
    fecha: datetime
    estado: str
    total: float
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class PedidoDetailRead(PedidoRead):
    detalles: List[DetallePedidoRead] = []

    model_config = ConfigDict(from_attributes=True)
