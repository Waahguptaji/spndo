# 🧾 Git Commit Convention — Spndo

We follow the **Conventional Commits** format to keep our history clean, readable, and automation-friendly.

## ✅ Format

<type>(<scope>): <short summary>

## 🔧 Types

| Type       | Use For                               |
| ---------- | ------------------------------------- |
| `feat`     | New feature or endpoint               |
| `fix`      | Bug fix or patch                      |
| `chore`    | Setup, configs, initial skeleton      |
| `docs`     | Readme or documentation changes       |
| `refactor` | Restructuring code (no logic changes) |
| `style`    | Code formatting, lint fixes, etc.     |
| `test`     | Adding/modifying tests                |
| `ci`       | GitHub Actions or pipeline changes    |
| `perf`     | Performance optimizations             |

## 🧠 Examples

- `feat(auth): implement JWT token generation`
- `fix(dashboard): handle empty chart data crash`
- `chore: initialize Next.js with Tailwind config`
- `docs: add setup steps to README`
- `refactor(auth): move logic to service layer`

## 📌 Guidelines

- Write commit message in **present tense**
  - ✅ “add expense API”
  - ❌ “added expense API”
- Use **feature branches**, never commit directly to `main`
- PR titles must match this format

---

Let me know if you'd like me to:

- Set up a **GitHub Action** to validate commit messages automatically
- Help you create `CONTRIBUTING.md` or `CODEOWNERS` file for structure later

Now go ahead and commit your first few changes with this standard. Ready for the next setup step?
