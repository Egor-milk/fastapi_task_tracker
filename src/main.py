from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

import uvicorn
from fastapi import FastAPI

from api.routers import all_routers
from db.db import delete_tables, create_tables


@asynccontextmanager # очищение базы при включении для удобства
async def lifespan(app: FastAPI):
    await delete_tables()
    print('База очищена')
    await create_tables()
    print('база готова к работе')
    yield
    print('выключение')



app = FastAPI(
    title="Упрощенный аналог Jira/Asana",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить все источники (или конкретные)
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PATCH"],  # Разрешить OPTIONS
    allow_headers=["*"],  # Разрешить все заголовки
)

for router in all_routers:
    app.include_router(router)


if __name__ == "__main__":
    uvicorn.run(app="main:app", reload=True)
