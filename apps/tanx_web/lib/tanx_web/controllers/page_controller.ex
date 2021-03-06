defmodule TanxWeb.PageController do
  use TanxWeb, :controller

  def index(conn, _params) do
    build_id = System.get_env("TANX_BUILD_ID") || "local"

    conn
    |> assign(:build_id, build_id)
    |> render("index.html")
  end

  def ready(conn, _params) do
    text(conn, "ok")
  end
end
