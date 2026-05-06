export default function ProfileSettingsPage() {
  return (
    <main className="container profile-container">
      <h1>Profile Settings</h1>
      <div className="panel">
        <input defaultValue="Julian Thorne" />
        <input defaultValue="julian.thorne@artisanal.com" />
        <input defaultValue="+1 (555) 012-3456" />
        <input defaultValue="128 Curator's Lane" />
        <button className="btn">Save Changes</button>
      </div>
    </main>
  );
}
