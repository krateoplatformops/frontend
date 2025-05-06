```bash
export NODE_PORT=$(kubectl get --namespace krateo-system -o jsonpath="{.spec.ports[0].nodePort}" services smithery)
  export NODE_IP=$(kubectl get nodes --namespace krateo-system -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT

http://192.168.148.3:31448
```