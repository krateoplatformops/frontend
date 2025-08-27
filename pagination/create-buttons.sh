#!/bin/bash

# Nome del namespace
NAMESPACE="demo-system"

# Crea il namespace se non esiste
kubectl get namespace $NAMESPACE >/dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Creating namespace: $NAMESPACE"
  kubectl create namespace $NAMESPACE
else
  echo "Namespace $NAMESPACE already exists"
fi

# Ciclo per creare 20 pod dummy
for i in {0..19}; do
  BUTTON_NAME="dummy-button-$i"

  echo "Creating button: $BUTTON_NAME"

  cat <<EOF | kubectl apply -f -
apiVersion: widgets.templates.krateo.io/v1beta1
kind: Button
metadata:
  name: $BUTTON_NAME
  namespace: $NAMESPACE
spec:
  widgetData:
    label: "Button $i"
    icon: "fa-solid fa-circle"
EOF

done

echo "✅ Tutti i pod dummy sono stati creati nel namespace '$NAMESPACE'"