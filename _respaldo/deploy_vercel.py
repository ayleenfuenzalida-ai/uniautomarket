
import urllib.request
import json
import time
from datetime import datetime

vercel_token = "vcp_6EMCS20jSuhvrkGvUvbOLyY1G3FUFeYND38unIgXIQdB1i8ALZ0lKecc"
project_id = "prj_smyZQl8HzNoUFhqpZVYphYCS2JLE"
repo_id = 1158752738

def try_deploy():
    url = "https://api.vercel.com/v13/deployments"
    headers = {
        "Authorization": f"Bearer {vercel_token}",
        "Content-Type": "application/json"
    }
    data = {
        "name": "uniautomarket",
        "project": project_id,
        "target": "production",
        "gitSource": {
            "type": "github",
            "repo": "ayleenfuenzalida-ai/uniautomarket",
            "ref": "main",
            "repoId": repo_id
        }
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return None

# Intentar despliegue
result = try_deploy()
if result:
    print(f"✅ DESPLIEGUE EXITOSO!")
    print(f"   ID: {result.get('id')}")
    print(f"   URL: https://uniautomarket.cl")
else:
    print("❌ Aún no se puede desplegar - límite no reseteado")
