const API_URL = "http://deploy.thiagosol.com";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form") as HTMLFormElement;
    const deployForm = document.getElementById("deploy-form") as HTMLFormElement;
    const logsContainer = document.getElementById("logs") as HTMLPreElement;
    const addEnvButton = document.getElementById("add-env") as HTMLButtonElement;
    const envVarsContainer = document.getElementById("env-vars-container") as HTMLDivElement;

    // Autenticação
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        // Salvar credenciais no Local Storage
        localStorage.setItem("deploy_user", username);
        localStorage.setItem("deploy_pass", password);

        loginForm.classList.add("hidden");
        deployForm.classList.remove("hidden");
    });

    // Função para buscar logs
    async function fetchLogs() {
        const service = (document.getElementById("service") as HTMLInputElement).value;
        if (!service) return;

        const username = localStorage.getItem("deploy_user")!;
        const password = localStorage.getItem("deploy_pass")!;
        const authHeader = "Basic " + btoa(`${username}:${password}`);

        const response = await fetch(`${API_URL}/logs/${service}`, {
            headers: { Authorization: authHeader }
        });

        logsContainer.textContent = await response.text();
    }

    // Adicionar variável de ambiente dinamicamente
    addEnvButton.addEventListener("click", () => {
        const envInput = document.createElement("input");
        envInput.type = "text";
        envInput.placeholder = "VAR=valor";
        envVarsContainer.appendChild(envInput);
    });

    // Enviar Deploy
    deployForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const service = (document.getElementById("service") as HTMLInputElement).value;
        const branch = (document.getElementById("branch") as HTMLInputElement).value;
        const username = localStorage.getItem("deploy_user")!;
        const password = localStorage.getItem("deploy_pass")!;
        const authHeader = "Basic " + btoa(`${username}:${password}`);

        // Coletar variáveis de ambiente
        const envVars = Array.from(envVarsContainer.getElementsByTagName("input"))
            .map(input => input.value)
            .filter(value => value !== "");

        await fetch(`${API_URL}/deploy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
            body: JSON.stringify({ service, branch, env_vars: envVars }),
        });

        alert(`🚀 Deploy para ${service} iniciado!`);
        fetchLogs();
    });

    // Atualizar logs automaticamente a cada 5s
    setInterval(fetchLogs, 5000);
});
