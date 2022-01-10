class WebSockets {
    getInfo: function() {
        return {
            "id": "WebSockets",
            "name": "Web Sockets",
            "blocks": [{
                    "opcode": "createws",
                    "blockType": "reporter",
                    "text": "connect to server at [address]",
                    "arguments": {
                        "address": {
                            "type": "string",
                            "defaultValue": "ws://localhost"
                        }
                    }
                },
            }],
        }
    };
    createws: function({address}) {
        return new WebSocket(address);
    };
}
