from __future__ import annotations

import argparse
from socketserver import ThreadingMixIn
from wsgiref.simple_server import WSGIServer, make_server

from app.backend.api import application


class ThreadingWSGIServer(ThreadingMixIn, WSGIServer):
    daemon_threads = True


def main() -> None:
    parser = argparse.ArgumentParser(description="Skill Dynamic Sandbox MVP API server")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", default=8000, type=int)
    args = parser.parse_args()

    with make_server(args.host, args.port, application, server_class=ThreadingWSGIServer) as server:
        print(f"Serving Skill Dynamic Sandbox MVP on http://{args.host}:{args.port}")
        server.serve_forever()


if __name__ == "__main__":
    main()
