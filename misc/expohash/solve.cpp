#include <iostream>
#include <vector>

using namespace std;

const int SIZE = 100000;
const int TEST_SIZE = 100000;
int l[TEST_SIZE];
int r[TEST_SIZE];
int v[TEST_SIZE];

vector<pair<int, int>> adj[SIZE + 1];
int ans[SIZE + 1];
int vis[SIZE + 1];

void dfs(int i) {
    vis[i] = true;
    for (auto p : adj[i]) {
        if (!vis[p.first]) {
            ans[p.first] = ans[i] ^ p.second;
            dfs(p.first);
        }
    }
}

int main() {
    for (int i = 0; i < TEST_SIZE; i++) {
        cin >> l[i] >> r[i] >> v[i];
        l[i]--;
        adj[l[i]].push_back({r[i], v[i]});
        adj[r[i]].push_back({l[i], v[i]});
    }

    for (int i = 0; i <= SIZE; i++) {
        if (!vis[i]) {
            dfs(i);
        }
    }

    for (int i = 0; i < SIZE; i++) {
        cout << (ans[i + 1] ^ ans[i]) << '\n';
    }
    cout << '\n';
    return 0;
}
