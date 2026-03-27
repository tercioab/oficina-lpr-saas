{ pkgs, ... }: {
  # Channel for packages
  channel = "stable-23.11";

  # Dependências do Sistema
  packages = [
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.nodejs_20
    pkgs.libgl1-mesa-glx
    pkgs.glib
    pkgs.opencv
  ];

  # Variáveis de ambiente
  env = {
    NEXT_PUBLIC_API_URL = "http://localhost:8000";
  };

  idx = {
    # Extensões do VS Code
    extensions = [
      "ms-python.python"
      "bradlc.vscode-tailwindcss"
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
    ];

    # Workspace lifecycle hooks
    onCreate = {
      # Instala dependências do backend
      install-python-deps = "pip install -r backend/requirements.txt";
      # Instala dependências do frontend
      install-node-deps = "cd frontend && npm install";
    };

    # Preview configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--prefix" "frontend" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
