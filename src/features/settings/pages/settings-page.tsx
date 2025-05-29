import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast-provider'

interface UserProfile {
  name: string
  email: string
  company: string
  role: string
  bio: string
  avatar: string
}

interface NotificationSettings {
  emailNotifications: boolean
  projectUpdates: boolean
  marketingEmails: boolean
  securityAlerts: boolean
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large'
  compactMode: boolean
}

export default function SettingsPage() {
  const { toast } = useToast()
  
  // Profil-Einstellungen
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Max Mustermann',
    email: 'max.mustermann@example.com',
    company: 'PixelMagix GmbH',
    role: 'UI/UX Designer',
    bio: 'Erfahrener Designer mit Schwerpunkt auf Benutzerfreundlichkeit und visuellem Design. Ich arbeite gerne an kreativen Projekten und helfe Unternehmen, ihre digitale Präsenz zu verbessern.',
    avatar: 'https://i.pravatar.cc/150?u=max',
  })

  // Benachrichtigungseinstellungen
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    projectUpdates: true,
    marketingEmails: false,
    securityAlerts: true,
  })

  // Darstellungseinstellungen
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'system',
    fontSize: 'medium',
    compactMode: false,
  })

  // Passwort-Änderung
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Handler für Profiländerungen
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  // Handler für Benachrichtigungsänderungen
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setNotifications(prev => ({ ...prev, [name]: checked }))
  }

  // Handler für Darstellungsänderungen
  const handleAppearanceChange = (setting: keyof AppearanceSettings, value: any) => {
    setAppearance(prev => ({ ...prev, [setting]: value }))
  }

  // Handler für Passwortänderungen
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  // Speichern der Profileinstellungen
  const saveProfile = () => {
    // Hier würde normalerweise ein API-Aufruf stehen
    toast.success('Profil gespeichert', 'Ihre Profilinformationen wurden erfolgreich aktualisiert.')
  }

  // Speichern der Benachrichtigungseinstellungen
  const saveNotifications = () => {
    // Hier würde normalerweise ein API-Aufruf stehen
    toast.success('Einstellungen gespeichert', 'Ihre Benachrichtigungseinstellungen wurden aktualisiert.')
  }

  // Speichern der Darstellungseinstellungen
  const saveAppearance = () => {
    // Hier würde normalerweise ein API-Aufruf stehen
    toast.success('Einstellungen gespeichert', 'Ihre Darstellungseinstellungen wurden aktualisiert.')
    
    // In einer echten Anwendung würde hier die Darstellung aktualisiert werden
    // z.B. document.documentElement.classList.toggle('dark', appearance.theme === 'dark')
  }

  // Ändern des Passworts
  const changePassword = () => {
    // Validierung
    if (!passwordData.currentPassword) {
      toast.error('Fehler', 'Bitte geben Sie Ihr aktuelles Passwort ein.')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Fehler', 'Das neue Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Fehler', 'Die Passwörter stimmen nicht überein.')
      return
    }
    
    // Hier würde normalerweise ein API-Aufruf stehen
    toast.success('Passwort geändert', 'Ihr Passwort wurde erfolgreich aktualisiert.')
    
    // Zurücksetzen der Felder
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Einstellungen</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                <a href="#profile" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground">
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil
                </a>
                <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted">
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Benachrichtigungen
                </a>
                <a href="#appearance" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted">
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Darstellung
                </a>
                <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted">
                  <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Sicherheit
                </a>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Profil-Einstellungen */}
          <Card id="profile">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Verwalten Sie Ihre persönlichen Informationen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={profile.avatar} 
                    alt="Profilbild" 
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">E-Mail</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">Unternehmen</label>
                  <Input
                    id="company"
                    name="company"
                    value={profile.company}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Position</label>
                  <Input
                    id="role"
                    name="role"
                    value={profile.role}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">Über mich</label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveProfile}>Änderungen speichern</Button>
            </CardFooter>
          </Card>
          
          {/* Benachrichtigungseinstellungen */}
          <Card id="notifications">
            <CardHeader>
              <CardTitle>Benachrichtigungen</CardTitle>
              <CardDescription>Verwalten Sie Ihre Benachrichtigungseinstellungen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">E-Mail-Benachrichtigungen</h3>
                  <p className="text-sm text-muted-foreground">Erhalten Sie E-Mail-Benachrichtigungen für wichtige Ereignisse</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="emailNotifications" 
                    checked={notifications.emailNotifications} 
                    onChange={handleNotificationChange} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Projekt-Updates</h3>
                  <p className="text-sm text-muted-foreground">Erhalten Sie Benachrichtigungen über Änderungen an Ihren Projekten</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="projectUpdates" 
                    checked={notifications.projectUpdates} 
                    onChange={handleNotificationChange} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Marketing-E-Mails</h3>
                  <p className="text-sm text-muted-foreground">Erhalten Sie Neuigkeiten, Angebote und Updates zu PixelMagix</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="marketingEmails" 
                    checked={notifications.marketingEmails} 
                    onChange={handleNotificationChange} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Sicherheitsbenachrichtigungen</h3>
                  <p className="text-sm text-muted-foreground">Erhalten Sie wichtige Sicherheitsbenachrichtigungen zu Ihrem Konto</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="securityAlerts" 
                    checked={notifications.securityAlerts} 
                    onChange={handleNotificationChange} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotifications}>Einstellungen speichern</Button>
            </CardFooter>
          </Card>
          
          {/* Darstellungseinstellungen */}
          <Card id="appearance">
            <CardHeader>
              <CardTitle>Darstellung</CardTitle>
              <CardDescription>Passen Sie das Erscheinungsbild der Anwendung an</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Farbschema</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${appearance.theme === 'light' ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => handleAppearanceChange('theme', 'light')}
                  >
                    <svg className="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm">Hell</span>
                  </div>
                  
                  <div 
                    className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${appearance.theme === 'dark' ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => handleAppearanceChange('theme', 'dark')}
                  >
                    <svg className="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="text-sm">Dunkel</span>
                  </div>
                  
                  <div 
                    className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${appearance.theme === 'system' ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => handleAppearanceChange('theme', 'system')}
                  >
                    <svg className="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">System</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Schriftgröße</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className={`flex items-center justify-center p-3 border rounded-md cursor-pointer ${appearance.fontSize === 'small' ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => handleAppearanceChange('fontSize', 'small')}
                  >
                    <span className="text-xs">Klein</span>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-center p-3 border rounded-md cursor-pointer ${appearance.fontSize === 'medium' ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => handleAppearanceChange('fontSize', 'medium')}
                  >
                    <span className="text-sm">Mittel</span>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-center p-3 border rounded-md cursor-pointer ${appearance.fontSize === 'large' ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => handleAppearanceChange('fontSize', 'large')}
                  >
                    <span className="text-base">Groß</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Kompakter Modus</h3>
                  <p className="text-sm text-muted-foreground">Reduziert den Abstand zwischen Elementen für mehr Inhalte auf dem Bildschirm</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={appearance.compactMode} 
                    onChange={(e) => handleAppearanceChange('compactMode', e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveAppearance}>Einstellungen speichern</Button>
            </CardFooter>
          </Card>
          
          {/* Sicherheitseinstellungen */}
          <Card id="security">
            <CardHeader>
              <CardTitle>Sicherheit</CardTitle>
              <CardDescription>Verwalten Sie Ihre Sicherheitseinstellungen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">Aktuelles Passwort</label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">Neues Passwort</label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <p className="text-xs text-muted-foreground">Passwort muss mindestens 8 Zeichen lang sein</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Passwort bestätigen</label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <Button onClick={changePassword}>Passwort ändern</Button>
              
              <div>
                <p className="text-sm text-muted-foreground">Letzte Anmeldung: 15.09.2023, 14:32 Uhr</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}