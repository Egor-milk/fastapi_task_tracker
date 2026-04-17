from contextlib import asynccontextmanager

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


for router in all_routers:
    app.include_router(router)


if __name__ == "__main__":
    uvicorn.run(app="main:app", reload=True)
