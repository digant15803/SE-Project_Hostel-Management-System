import React from "react"

export default function MessLayout({children}) {
    return (
      <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        {children}
      </section>
    )
  }