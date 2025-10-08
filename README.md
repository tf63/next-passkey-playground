# Next.jsにパスキーを導入してみる

>[!WARNING]
>このプロジェクトは実験的なものであり、商用利用には適していません。
>
>This project is experimental and not suitable for production use.


これをNext.jsのserver actionsで動かしてみる
https://simplewebauthn.dev/docs/packages/server

## Setup

```shell
pnpx auth secret
```

```shell
pnpm dev
```

## やってもやさそうなこと

- DB永続化, オリジンを変えてパスキーが使えないことを確認する
- Passkey Autofill対応
